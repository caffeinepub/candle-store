import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include storage system
  include MixinStorage();

  // Initialize authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog Types
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceINR : Float;
    stockQuantity : Nat;
    category : Text;
    photoUrls : [Storage.ExternalBlob];
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
    priceINR : Float;
  };

  public type WishlistItem = {
    productId : Text;
    addedAt : Time.Time;
  };

  public type Reward = {
    id : Text;
    description : Text;
    pointsRequired : Nat;
    discountPercentage : Float;
  };

  public type PointsHistory = {
    timestamp : Time.Time;
    points : Nat;
    description : Text;
  };

  public type Review = {
    productId : Text;
    userId : Text;
    rating : Nat; // 1-5
    reviewText : Text;
    timestamp : Time.Time;
  };

  public type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
    country : Text;
  };

  public type Order = {
    id : Text;
    userId : Text;
    items : [CartItem];
    shippingAddress : Address;
    totalAmount : Float;
    timestamp : Time.Time;
  };

  public type SupportRequest = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
  };

  // Product Catalog Storage
  let products = Map.empty<Text, Product>();

  // Cart & Wishlist Storage
  let userCarts = Map.empty<Text, [CartItem]>();
  let userWishlists = Map.empty<Text, [WishlistItem]>();

  // Rewards Storage
  let rewards = Map.empty<Text, Reward>();
  let userPoints = Map.empty<Text, Nat>();
  let pointsHistory = Map.empty<Text, [PointsHistory]>();

  // Reviews Storage
  let reviews = Map.empty<Text, [Review]>();

  // Orders & Support Storage
  let orders = Map.empty<Text, Order>();
  let supportRequests = Map.empty<Text, SupportRequest>();

  // Product Catalog Methods (admin-only mutations, public reads)
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  // Public product reads - no auth required
  public query func getProducts() : async [Product] {
    products.values().toArray().sort(func(p1 : Product, p2 : Product) : Order.Order {
      switch (Text.compare(p1.name, p2.name)) {
        case (#equal) { Text.compare(p1.description, p2.description) };
        case (order) { order };
      };
    });
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p : Product) : Bool { p.category == category }).sort(
      func(p1 : Product, p2 : Product) : Order.Order {
        switch (Text.compare(p1.name, p2.name)) {
          case (#equal) { Text.compare(p1.description, p2.description) };
          case (order) { order };
        };
      }
    );
  };

  public query func getProductById(productId : Text) : async ?Product {
    products.get(productId);
  };

  // Cart Methods - require logged-in user
  public shared ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their cart");
    };
    switch (userCarts.get(caller.toText())) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func updateCart(cart : [CartItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their cart");
    };
    userCarts.add(caller.toText(), cart);
  };

  // Wishlist Methods - require logged-in user
  public shared ({ caller }) func getWishlist() : async [WishlistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their wishlist");
    };
    switch (userWishlists.get(caller.toText())) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
  };

  public shared ({ caller }) func updateWishlist(wishlist : [WishlistItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their wishlist");
    };
    userWishlists.add(caller.toText(), wishlist);
  };

  // Rewards Methods - public read, admin-only write
  public query func getRewards() : async [Reward] {
    rewards.values().toArray();
  };

  public shared ({ caller }) func addReward(reward : Reward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add rewards");
    };
    rewards.add(reward.id, reward);
  };

  // User points - require logged-in user to view own points
  public shared ({ caller }) func getUserPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their points");
    };
    switch (userPoints.get(caller.toText())) {
      case (null) { 0 };
      case (?pts) { pts };
    };
  };

  public shared ({ caller }) func getPointsHistory() : async [PointsHistory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their points history");
    };
    switch (pointsHistory.get(caller.toText())) {
      case (null) { [] };
      case (?history) { history };
    };
  };

  // Review Methods - public read, user-only write
  public query func getReviewsByProduct(productId : Text) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?productReviews) { productReviews };
    };
  };

  public shared ({ caller }) func addReview(review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can submit reviews");
    };
    let currentReviews = switch (reviews.get(review.productId)) {
      case (null) { [] };
      case (?productReviews) { productReviews };
    };
    let updatedReviews = currentReviews.concat([review]);
    reviews.add(review.productId, updatedReviews);
  };

  // Support Methods - contact form is public (guests can submit), admin-only read
  public shared ({ caller = _ }) func addSupportRequest(request : SupportRequest) : async () {
    // Public: anyone including guests can submit a support request
    supportRequests.add(request.id, request);
  };

  public query ({ caller }) func getSupportRequests() : async [SupportRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view support requests");
    };
    supportRequests.values().toArray();
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Stripe Integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?config) { config };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?config) { config };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };
};

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Review {
    userId: string;
    reviewText: string;
    productId: string;
    timestamp: Time;
    rating: bigint;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    photoUrls: Array<ExternalBlob>;
    name: string;
    description: string;
    category: string;
    priceINR: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Reward {
    id: string;
    pointsRequired: bigint;
    description: string;
    discountPercentage: number;
}
export interface WishlistItem {
    productId: string;
    addedAt: Time;
}
export interface PointsHistory {
    description: string;
    timestamp: Time;
    points: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface SupportRequest {
    id: string;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
    priceINR: number;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addReview(review: Review): Promise<void>;
    addReward(reward: Reward): Promise<void>;
    addSupportRequest(request: SupportRequest): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getPointsHistory(): Promise<Array<PointsHistory>>;
    getProductById(productId: string): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getReviewsByProduct(productId: string): Promise<Array<Review>>;
    getRewards(): Promise<Array<Reward>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSupportRequests(): Promise<Array<SupportRequest>>;
    getUserPoints(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<WishlistItem>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCart(cart: Array<CartItem>): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateWishlist(wishlist: Array<WishlistItem>): Promise<void>;
}

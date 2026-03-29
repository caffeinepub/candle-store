import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Settings, Plus, Trash2, Edit3, Package, CreditCard, Loader2, X, Check, ShieldAlert,
} from 'lucide-react';
import {
  useGetProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useIsCallerAdmin, useIsStripeConfigured,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';
import PaymentSetup from '../components/PaymentSetup';
import { toast } from 'sonner';
import type { Product } from '../backend';

const EMPTY_PRODUCT: Omit<Product, 'photoUrls'> & { photoUrlsInput: string } = {
  id: '',
  name: '',
  description: '',
  priceINR: 0,
  stockQuantity: BigInt(0),
  category: '',
  photoUrlsInput: '',
};

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: stripeConfigured } = useIsStripeConfigured();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showStripeSetup, setShowStripeSetup] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.id.trim()) errors.id = 'Product ID is required';
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (form.priceINR <= 0) errors.priceINR = 'Price must be greater than 0';
    if (!form.category.trim()) errors.category = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const photoUrls = form.photoUrlsInput
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ExternalBlob.fromURL(url));

    const productData: Product = {
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      priceINR: form.priceINR,
      stockQuantity: form.stockQuantity,
      category: form.category.trim(),
      photoUrls,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully!');
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm(EMPTY_PRODUCT);
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      priceINR: product.priceINR,
      stockQuantity: product.stockQuantity,
      category: product.category,
      photoUrlsInput: product.photoUrls.map((p) => p.getDirectURL?.() ?? '').join('\n'),
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(productId);
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setFormErrors({});
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground">Please sign in to access the admin panel.</p>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-violet-500" />
          <h1 className="font-display text-2xl font-semibold">Admin Panel</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setShowStripeSetup(true)}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {stripeConfigured ? 'Stripe ✓' : 'Setup Stripe'}
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
            onClick={() => { setShowForm(true); setEditingProduct(null); setForm(EMPTY_PRODUCT); }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-violet-200 p-6 mb-8 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={handleCancelForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pid">Product ID</Label>
                <Input
                  id="pid"
                  placeholder="candle-001"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editingProduct}
                  className={formErrors.id ? 'border-destructive' : ''}
                />
                {formErrors.id && <p className="text-xs text-destructive">{formErrors.id}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pname">Product Name</Label>
                <Input
                  id="pname"
                  placeholder="Lavender Dream Candle"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pdesc">Description</Label>
              <Textarea
                id="pdesc"
                placeholder="Describe your candle..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={formErrors.description ? 'border-destructive' : ''}
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pprice">Price (₹)</Label>
                <Input
                  id="pprice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="499"
                  value={form.priceINR || ''}
                  onChange={(e) => setForm({ ...form, priceINR: parseFloat(e.target.value) || 0 })}
                  className={formErrors.priceINR ? 'border-destructive' : ''}
                />
                {formErrors.priceINR && <p className="text-xs text-destructive">{formErrors.priceINR}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pstock">Stock Quantity</Label>
                <Input
                  id="pstock"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={Number(form.stockQuantity) || ''}
                  onChange={(e) => setForm({ ...form, stockQuantity: BigInt(parseInt(e.target.value) || 0) })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pcat">Category</Label>
                <Input
                  id="pcat"
                  placeholder="Scented"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={formErrors.category ? 'border-destructive' : ''}
                />
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pphotos">Photo URLs (one per line)</Label>
              <Textarea
                id="pphotos"
                placeholder="https://example.com/candle1.jpg&#10;https://example.com/candle2.jpg"
                rows={3}
                value={form.photoUrlsInput}
                onChange={(e) => setForm({ ...form, photoUrlsInput: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" className="rounded-full" onClick={handleCancelForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addProduct.isPending || updateProduct.isPending}
                className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
              >
                {(addProduct.isPending || updateProduct.isPending) ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> {editingProduct ? 'Update' : 'Add'} Product</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div>
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-violet-500" />
          Products ({products?.length ?? 0})
        </h2>

        {productsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No products yet. Add your first candle!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const imageUrl = product.photoUrls?.[0]?.getDirectURL?.() ?? '';
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-violet-200 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-violet-50 border border-border flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🕯️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm text-foreground">{product.name}</h3>
                      <Badge variant="outline" className="text-xs text-violet-500 border-violet-200">
                        {product.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-violet-600">₹{product.priceINR.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-muted-foreground">Stock: {Number(product.stockQuantity)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stripe Setup Modal */}
      <PaymentSetup open={showStripeSetup} onClose={() => setShowStripeSetup(false)} />
    </div>
  );
}

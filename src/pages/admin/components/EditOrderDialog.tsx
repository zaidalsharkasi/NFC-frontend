import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Check,
  Package,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard as Payment,
  Truck,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { updateOrder } from '@/lib/service/endpoints';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const EditOrderDialog = ({ isOpen, onClose, order }: EditOrderDialogProps) => {
  const [status, setStatus] = useState(order.status);
  const { toast } = useToast();

  const { mutate: updateOrderMutation, isPending: isUpdatingOrder } =
    useMutation({
      mutationFn: (data: any) => updateOrder(data._id, { status: data.status }),
      onSuccess: () => {
        toast({
          title: 'Status Updated',
          description: 'Order status has been updated successfully.',
        });
        onClose();
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        toast({
          title: 'Update Failed',
          description:
            error?.response?.data?.message || 'Failed to update status.',
          variant: 'destructive',
        });
      },
    });

  const handleStatusUpdate = () => {
    updateOrderMutation({
      _id: order._id,
      status,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Order Details{' '}
            <span className="text-muted-foreground font-mono">
              #{order._id.slice(-8)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Update Section */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order Status
                </div>
                <div className="flex items-center gap-4">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingOrder || status === order.status}
                    className="btn-hero"
                  >
                    Update Status
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Order Information */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" /> Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Product:</span>
                    <p>{order.product.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-semibold">{order.product.price} JOD</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" /> Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p>{order.customerFullName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Organization:</span>
                    <p>{order.personalInfo?.organization || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Position:</span>
                    <p>{order.personalInfo?.position || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p>{order.personalInfo?.email}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Phone Numbers:
                    </span>
                    <p>{order.personalInfo?.phoneNumbers.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">LinkedIn:</span>
                    <p>{order.personalInfo?.linkedinUrl || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Delivery Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p>{order.deliveryInfo?.addressLine1}</p>
                    {order.deliveryInfo?.addressLine2 && (
                      <p>{order.deliveryInfo.addressLine2}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p>
                      {order.deliveryInfo?.city?.name},{' '}
                      {order.deliveryInfo?.country?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Payment className="w-5 h-5" /> Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>
                    <p className="capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <p className="font-semibold">{order.totalAmount} JOD</p>
                  </div>
                </div>
              </div>

              {/* Order Dates */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Order Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <p>{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;

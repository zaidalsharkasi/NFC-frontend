import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form } from '@/components/ui/form';
import CustomFileUpload from '@/components/form/CustomFileUpload';
import {
  getHeaderImages,
  createHeaderImage,
  updateHeaderImage,
  deleteHeaderImage,
} from '@/lib/service/endpoints';
import {
  headerImageSchema,
  type HeaderImageFormData,
  type HeaderImage,
} from '@/lib/schemas/headerImageSchema';
import PageHeader from './_components/pageHeader';
import SubmitButton from '@/components/ui/SubmitButton';

const HeaderImagePage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: headerImagesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getHeaderImages'],
    queryFn: getHeaderImages,
  });

  const createMutation = useMutation({
    mutationFn: createHeaderImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getHeaderImages'] });
      toast.success('Header image created successfully!');
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to create header image');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateHeaderImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getHeaderImages'] });
      toast.success('Header image updated successfully!');
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to update header image');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHeaderImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getHeaderImages'] });
      toast.success('Header image deleted successfully!');
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete header image');
    },
  });

  const headerImage = headerImagesData?.data?.data?.data?.[0] || null;

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (headerImage) {
      deleteMutation.mutate(headerImage._id);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader
          title="Header Image Management"
          description="Manage the header image for your website"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Failed to load header image. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Header Image Management"
        description="Manage the header image for your website"
      />

      <div className="max-w-4xl mx-auto">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Header Image
            </CardTitle>
            <p className="text-muted-foreground">
              Upload and manage the main header image displayed on your website
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Loading header image...
                  </p>
                </div>
              </div>
            ) : headerImage ? (
              <div className="space-y-6">
                {/* Current Image Display */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Current Header Image
                    </h3>
                    <div className="border rounded-lg overflow-hidden bg-muted/20">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_DOMAIN}${
                          headerImage.image
                        }`}
                        crossOrigin="anonymous"
                        alt="Current header image"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>

                  {/* Image Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        ID
                      </label>
                      <p className="font-mono text-sm">{headerImage._id}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Update Image
                  </Button>
                  {/* <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Image
                  </Button> */}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Header Image</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first header image to get started.
                </p>
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Header Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <EditHeaderImageDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        headerImage={headerImage}
        onSubmit={(id, data) => {
          if (id) {
            updateMutation.mutate({ id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isLoading={updateMutation.isPending || createMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteHeaderImageDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

// Edit/Create Dialog Component
const EditHeaderImageDialog = ({
  isOpen,
  onClose,
  headerImage,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  headerImage: HeaderImage | null;
  onSubmit: (id: string | null, data: FormData) => void;
  isLoading: boolean;
}) => {
  const form = useForm<HeaderImageFormData>({
    resolver: zodResolver(headerImageSchema),
    defaultValues: {
      image: headerImage?.image || null,
    },
  });

  const handleSubmit = (data: HeaderImageFormData) => {
    const formData = new FormData();
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (typeof data.image === 'string' && data.image) {
      formData.append('image', data.image);
    }
    onSubmit(headerImage?._id || null, formData);
  };

  const isEditing = !!headerImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Update Header Image' : 'Upload Header Image'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the header image for your website.'
              : 'Upload a new header image for your website.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <CustomFileUpload
              name="image"
              label="Header Image"
              required={true}
              accept="image/*"
              preview={true}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <SubmitButton disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? 'Updating...'
                    : 'Uploading...'
                  : isEditing
                  ? 'Update'
                  : 'Upload'}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Dialog Component
const DeleteHeaderImageDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Header Image</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this header image? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HeaderImagePage;

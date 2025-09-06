import { getAddons } from '@/lib/service/endpoints';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, DollarSign, Plus, X, Upload } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface Addon {
  _id: string;
  title: string;
  price: number;
  options?: string[];
  inputType: 'text' | 'number' | 'radio' | 'select' | 'image';
  createdAt: string;
  updatedAt: string;
}

interface AddonSelection {
  addon: string; // Addon ID
  addonValue: string;
}

interface Step4AddonsProps {
  product: any;
}

function Step4Addons({ product }: Step4AddonsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['getAddons'],
    queryFn: () => getAddons(),
  });

  const { setValue, watch } = useFormContext();
  const selectedAddons = watch('addons') || [];
  const addonImages = watch('addonImages') || [];

  const [newImage, setNewImage] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const addons = data?.data?.data?.data || [];

  const toggleSection = (addonId: string) => {
    setExpandedSections((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getInputTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-blue-500';
      case 'number':
        return 'bg-green-500';
      case 'radio':
        return 'bg-purple-500';
      case 'select':
        return 'bg-orange-500';
      case 'image':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddonSelection = (
    addonId: string,
    value: string | File,
    isImage: boolean = false,
    inputType: string = '',
    price: number = 0
  ) => {
    const existingIndex = selectedAddons.findIndex(
      (item: AddonSelection) => item.addon === addonId
    );

    const addonData = {
      addon: addonId,
      addonValue: value,
      inputType: inputType,
      price: price,
    };

    if (isImage && value) {
      setValue('addonImages', [...addonImages, value]);
    }

    if (existingIndex >= 0) {
      // Update existing selection
      const updatedAddons = [...selectedAddons];
      updatedAddons[existingIndex] = addonData;
      setValue('addons', updatedAddons);
    } else {
      // Add new selection
      setValue('addons', [...selectedAddons, addonData]);
    }
  };

  const handleRemoveAddon = (addonId: string) => {
    const updatedAddons = selectedAddons.filter(
      (item: AddonSelection) => item.addon !== addonId
    );
    setValue('addons', updatedAddons);
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setValue('addonImages', [...addonImages, newImage.trim()]);
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = addonImages.filter(
      (_: string, i: number) => i !== index
    );
    setValue('addonImages', updatedImages);
  };

  console.log('watch...', watch());
  const renderAddonInput = (addon: Addon) => {
    const selectedValue =
      selectedAddons.find((item: AddonSelection) => item.addon === addon._id)
        ?.addonValue || '';

    switch (addon.inputType) {
      case 'text':
        return (
          <Input
            placeholder="Enter text"
            value={selectedValue}
            onChange={(e) =>
              handleAddonSelection(
                addon._id,
                e.target.value,
                false,
                addon.inputType,
                addon.price
              )
            }
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter number"
            value={selectedValue}
            onChange={(e) =>
              handleAddonSelection(
                addon._id,
                e.target.value,
                false,
                addon.inputType,
                addon.price
              )
            }
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={selectedValue}
            onValueChange={(value) =>
              handleAddonSelection(
                addon._id,
                value,
                false,
                addon.inputType,
                addon.price
              )
            }
          >
            {addon.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${addon._id}-${index}`} />
                <Label htmlFor={`${addon._id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'select':
        return (
          <Select
            value={selectedValue}
            onValueChange={(value) =>
              handleAddonSelection(
                addon._id,
                value,
                false,
                addon.inputType,
                addon.price
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {addon.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              max={1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle file upload logic here
                  handleAddonSelection(
                    addon._id,
                    file,
                    true,
                    addon.inputType,
                    addon.price
                  );
                }
              }}
            />
            {selectedValue && (
              <img
                src={URL.createObjectURL(selectedValue)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Add-ons & Customizations</h2>
          <p className="text-muted-foreground">Loading available add-ons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Add-ons & Customizations</h2>
          <p className="text-muted-foreground">
            Failed to load add-ons. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          Order Your <span className="gradient-text">NFC Card</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Customize Your Order
        </p>
        <p className="text-muted-foreground">
          Click on any add-on to see options and customize your NFC card
        </p>
      </div>

      {/* Available Add-ons */}
      {selectedAddons.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Selected Add-ons</h3>
                <p className="text-muted-foreground">
                  {selectedAddons.length}{' '}
                  {selectedAddons.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Add-ons</p>
                <p className="text-2xl font-bold gradient-text">
                  {selectedAddons
                    .reduce(
                      (total: number, addon: any) => total + addon.price,
                      0
                    )
                    .toFixed(2)}{' '}
                  JOD
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4 max-w-4xl mx-auto">
        {addons.map((addon: Addon) => {
          const isSelected = selectedAddons.some(
            (item: AddonSelection) => item.addon === addon._id
          );

          return (
            <div
              key={addon._id}
              className={`bg-card border border-border rounded-lg transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
            >
              <button
                type="button"
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection(addon._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="flex gap-2 ">
                      <h3 className="text-xl font-semibold">{addon.title}</h3>
                      <span className="text-md font-semibold rounded-xl px-2 py-1 bg-primary text-primary-foreground">
                        {addon.price} JOD
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {addon.inputType === 'text' &&
                        'Add personalized text to the back of your card'}
                      {addon.inputType === 'image' &&
                        'Upload an extra logo or image to be printed on your card'}
                      {addon.inputType === 'select' &&
                        'Choose from available options'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedSections.includes(addon._id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {expandedSections.includes(addon._id) && (
                <div className="p-6 border-t border-border bg-card/50">
                  <div className="space-y-4">
                    {renderAddonInput(addon)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAddon(addon._id)}
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Add-on
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      {selectedAddons.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Selected Add-ons</h3>
                <p className="text-muted-foreground">
                  {selectedAddons.length}{' '}
                  {selectedAddons.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Add-ons</p>
                <p className="text-2xl font-bold gradient-text">
                  {selectedAddons
                    .reduce(
                      (total: number, addon: any) => total + addon.price,
                      0
                    )
                    .toFixed(2)}{' '}
                  JOD
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step4Addons;

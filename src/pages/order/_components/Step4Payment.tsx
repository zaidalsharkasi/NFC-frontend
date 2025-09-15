import CustomFileUpload from '@/components/form/CustomFileUpload';
import CustomRadioGroup from '@/components/form/CustomRadioGroup';
import { CreditCard, Truck } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

function Step4Payment() {
  const { watch, formState } = useFormContext();
  console.log('formState.errors', formState.errors);
  return (
    <div className="space-y-6">
      <CustomRadioGroup
        name="paymentMethod"
        label="Payment Method"
        required={true}
        options={[
          {
            value: 'cash',
            label: 'Cash on Delivery',
            description: 'Payment will be collected upon delivery',
            icon: <Truck className="w-5 h-5 text-muted-foreground" />,
          },
          {
            value: 'online',
            label: 'Bank Transaction',
            description: 'Secure Bank Transactions  ',
            icon: <CreditCard className="w-5 h-5 text-muted-foreground" />,
          },
        ]}
      />
      {watch('paymentMethod') === 'online' && (
        <>
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-foreground">
              Bank Transfer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">
                  Bank Name:
                </span>
                <p className="text-foreground">Jordan Islamic Bank</p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">
                  Account Holder:
                </span>
                <p className="text-foreground">NFC Cards Company</p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">
                  Account Number:
                </span>
                <p className="text-foreground font-mono bg-muted px-2 py-1 rounded">
                  0310167281820501
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">IBAN:</span>
                <p className="text-foreground font-mono bg-muted px-2 py-1 rounded">
                  JO71UBSI1200000310167281820501
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">
                  Swift Code:
                </span>
                <p className="text-foreground font-mono bg-muted px-2 py-1 rounded">
                  UBSIJOAX
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-muted-foreground">
                  Currency:
                </span>
                <p className="text-foreground">JOD</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-foreground">Important:</span>{' '}
                Please include your order number in the transfer reference.
                Upload the transaction receipt below after completing the
                transfer.
              </p>
            </div>
          </div>
          <CustomFileUpload
            name="despositeTransactionImg"
            label="Deposit Transaction Image"
            required={false}
            preview={true}
          />
        </>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          📦 Standard delivery within 2–4 days. You will receive a confirmation
          by SMS or email.
        </p>
      </div>
    </div>
  );
}

export default Step4Payment;

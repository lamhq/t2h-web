import React from 'react';
import PaymentType from './index';

export default { title: 'Molecules|PaymentType' };

export const Normal = () => {
  const [isVisaChecked, setIsVisaChecked] = React.useState(false);
  const [isBankChecked, setIsBankChecked] = React.useState(false);
  const [isOtherChecked, setIsOtherChecked] = React.useState(false);

  return (
    <React.Fragment>
      <PaymentType
        name="visa"
        label={`Visa (Direct debit)`}
        logo="/static/images/visa.png"
        checked={isVisaChecked}
        onChange={(e) => setIsVisaChecked(e.target.checked)}
      />
      <PaymentType
        name="bankTransfer"
        label={`Bank transfer`}
        logo="/static/images/bank-transfer.png"
        checked={isBankChecked}
        onChange={(e) => setIsBankChecked(e.target.checked)}
      />
      <PaymentType
        name="other"
        label={`Other`}
        logo="/static/images/other.png"
        checked={isOtherChecked}
        onChange={(e) => setIsOtherChecked(e.target.checked)}
      />
    </React.Fragment>
  );
};

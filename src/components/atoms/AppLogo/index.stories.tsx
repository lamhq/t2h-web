import React from 'react';
import { MobileAppLogo, AppLogo } from './index';

export default { title: 'Atoms|AppLogo' };

export const Laptop = () => <AppLogo width={350} height={100} />;

export const Mobile = () => <MobileAppLogo width={142} height={100} />;

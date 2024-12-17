import React from 'react';
import styled from 'styled-components';
import { LanguageIcon } from '@components/atoms/IconButton';
import Popover from '@components/molecules/Popover';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
// eslint-disable-next-line no-restricted-imports
import { MenuItem } from '@material-ui/core';
import { TextLabel } from '@components/atoms/Text';
import { CircleThIcon, CircleEnIcon } from '@components/atoms/IconButton';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';

interface LanguageSwitcherProps extends WithTranslation {
  size?: string;
  isAnchor?: boolean;
}

const StyledTextLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <TextLabel variant="small" lineHeight="20px" fontFamily="secondary">
      {children}
    </TextLabel>
  );
};

const ItemMenusContainer = styled.div`
  padding: 8px;
  box-sizing: border-box;
`;

const CircleIconContainer = styled(Flex)`
  margin-right: 10px;
`;

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = (props: LanguageSwitcherProps) => {
  const { t, i18n, size, isAnchor } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const onIconClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen((isOpen) => !isOpen);
    },
    [setIsOpen],
  );
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const onMenuClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false);
    },
    [setIsOpen],
  );
  const onContainerClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onLanguageSelect = React.useCallback(
    (lang: string) => () => {
      if (i18n.language === 'en' && lang === 'th') {
        i18n.changeLanguage('th');
      } else if (i18n.language === 'th' && lang === 'en') {
        i18n.changeLanguage('en');
      }
    },
    [i18n],
  );
  const onLanguageSwitch = React.useCallback(
    (lang: string) => () => {
      if (i18n.language === 'en' && lang === 'th') {
        i18n.changeLanguage('th');
      } else if (i18n.language === 'th' && lang === 'en') {
        i18n.changeLanguage('en');
      }
    },
    [i18n],
  );

  return (
    <div onClick={onContainerClick}>
      <Popover
        open={isOpen}
        onClose={onClose}
        anchor={
          isAnchor ? (
            <Box onClick={onIconClick} ml={size}>
              <StyledTextLabel>{t(`Language`)}</StyledTextLabel>
            </Box>
          ) : (
            <LanguageIcon onClick={onIconClick} size={size} />
          )
        }
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <ItemMenusContainer onClick={onMenuClick}>
          <MenuItem
            onSelect={onLanguageSelect('th')}
            onClick={onLanguageSwitch('th')}
            style={{ background: i18n.language === 'th' ? 'lightgray' : '' }}
          >
            <CircleIconContainer>
              <CircleThIcon size="22px" />
            </CircleIconContainer>
            <StyledTextLabel>{t(`Thai`)}</StyledTextLabel>
          </MenuItem>
          <MenuItem
            onSelect={onLanguageSelect('en')}
            onClick={onLanguageSwitch('en')}
            style={{ background: i18n.language === 'en' ? 'lightgray' : '' }}
          >
            <CircleIconContainer>
              <CircleEnIcon size="22px" />
            </CircleIconContainer>
            <StyledTextLabel>{t(`English`)}</StyledTextLabel>
          </MenuItem>
        </ItemMenusContainer>
      </Popover>
    </div>
  );
};

export default withTranslation('common')(LanguageSwitcher);

import React from 'react';
import { Text } from '@components/atoms/Text';
import { ItemResponse, ItemStatus } from '@services/types';
import { TFunction } from 'next-i18next';
import { MenuItem, MenuItemLink } from '@components/atoms/MenuItem';
import ItemDropdown from '@components/molecules/ItemDropdown';

interface ItemMenusProps {
  t: TFunction;
  item: ItemResponse;
  onDeleteClick: (item: ItemResponse) => void;
}

const ItemMenus = (props: ItemMenusProps) => {
  const { t, item, onDeleteClick } = props;
  const onDeleteMenuClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onDeleteClick(item);
    },
    [onDeleteClick, item],
  );

  return (
    <ItemDropdown>
      {[ItemStatus.Submitted, ItemStatus.Pending, ItemStatus.Rejected, ItemStatus.Draft].indexOf(item.status) !== -1 && (
        <MenuItemLink href={`/listing/add?hashId=${item.hashId}`}>
          <Text m={0} color="text">
            {t(`Edit listing`)}
          </Text>
        </MenuItemLink>
      )}
      {[ItemStatus.Published, ItemStatus.Sold].indexOf(item.status) !== -1 && (
        <MenuItemLink href={`/listing/[hashId]/edit`} as={`/listing/${item.hashId}/edit`}>
          <Text m={0} color="text">
            {t(`Edit listing`)}
          </Text>
        </MenuItemLink>
      )}
      {item.status === ItemStatus.Published && (
        <MenuItemLink href={`/listing/[hashId]/boost`} as={`/listing/${item.hashId}/boost`}>
          <Text m={0} color="text">
            {t(`Boost listing`)}
          </Text>
        </MenuItemLink>
      )}
      <MenuItem onClick={onDeleteMenuClick}>
        <Text m={0} color="danger">
          {t(`Delete listing`)}
        </Text>
      </MenuItem>
    </ItemDropdown>
  );
};

export default ItemMenus;

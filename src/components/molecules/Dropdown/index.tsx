import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TextLabel } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';
import { throttle } from '@common/utils';
import Box from '@components/layouts/Box';

export interface DropdownItem {
  [key: string]: any;
  value: string | number;
  label?: string;
  group?: string;
}

interface DropdownProps {
  ref?: React.Ref<HTMLInputElement>;
  options: DropdownItem[];
  value?: string | number;
  name?: string;
  placeholder?: string;
  height?: string;
  onChange?: (selected: DropdownItem) => void;
  isLeftIconVisible?: boolean;
  defaultValue?: string | number;
  hasError?: boolean;
  groupOrders?: string[];
  leftIconRenderer?: React.ComponentType<DropdownItem>;
}

const DropdownRoot = styled.div`
  position: relative;
  min-height: 38px;
  cursor: pointer;
`;

const DropdownControl = styled.div<{ height: string; hasError: boolean }>`
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border: ${({ theme, hasError }) => `1px solid ${hasError ? theme.colors.danger : theme.colors.border}`};
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  padding: 0px 38px 0px 8px;
  height: ${({ height }) => height};
`;

const DropdownValue = styled.div`
  color: ${({ theme }) => theme.colors.inputText};
`;

const DropdownPlaceholder = styled.div<{ height: string }>`
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: ${({ theme }) => theme.fontSizes[1]};
  min-height: ${({ height }) => height};
  line-height: ${({ height }) => height};
`;

const DropdownArrow = styled.div<{ isOpen?: boolean }>`
  border-color: ${({ isOpen }) => (isOpen ? 'transparent transparent #222222;' : '#222222 transparent transparent')};
  border-width: ${({ isOpen }) => (isOpen ? '0 5px 5px' : '5px 5px 0;')};
  border-style: solid;
  content: ' ';
  display: block;
  height: 0;
  margin-top: -ceil(2.5);
  position: absolute;
  right: 10px;
  top: 50%;
  width: 0;
`;

const DropdownMenu = styled.div`
  background-color: #ffffff;
  border: ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  margin-top: 1px;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1200;
`;

const DropdownOption = styled.div<{ isSelected: boolean }>`
  color: ${({ theme }) => theme.colors.inputText};
  padding: 0px 12px 0px 12px;
  ${({ isSelected }) =>
    isSelected
      ? css`
          background-color: ${({ theme }) => theme.colors.selected};
        `
      : ''};

  &:hover {
    background-color: ${({ theme }) => theme.colors.selected};
  }
`;

const LeftIconWrapper = styled.div`
  width: 30px;
  height: 30px;
  margin: 0px 15px 0px 0px;
`;

interface DropdownItemProps {
  item: DropdownItem;
  height: string;
  isLeftIconVisible?: boolean;
  leftIconRenderer?: React.ComponentType<DropdownItem>;
}

const DropdownItem: React.FC<DropdownItemProps> = (props: DropdownItemProps) => {
  const { item, height, isLeftIconVisible, leftIconRenderer } = props;

  return (
    <Flex alignItems="center">
      {isLeftIconVisible && <LeftIconWrapper>{React.createElement(leftIconRenderer, item, null)}</LeftIconWrapper>}
      <Flex height={height} alignItems="center">
        <TextLabel variant="small" color="inputText">
          {item.label ?? item.value}
        </TextLabel>
      </Flex>
    </Flex>
  );
};

const DEFAULT_KEY = 'default_dropdown_key';

const Dropdown: React.FC<DropdownProps> = React.forwardRef((props: DropdownProps, ref: React.Ref<HTMLInputElement>) => {
  const { onChange, height, name, options, isLeftIconVisible, value, defaultValue, hasError, leftIconRenderer } = props;
  let { groupOrders } = props;
  const initialItem = React.useMemo(
    () =>
      options.find((i) => {
        if (value) {
          return i.value === value;
        } else {
          return i.value === defaultValue;
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // try show by group if group key specified
  const groups = new Map<string, DropdownItem[]>();

  options.forEach((option) => {
    const group = option.group ?? DEFAULT_KEY;

    if (groups.has(group)) {
      groups.get(group).push(option);
    } else {
      groups.set(group, [option]);
    }
  });

  const groupsKeys = Array.from(groups.keys());

  // sorted by group orders
  if (!groupOrders) {
    groupOrders = groupsKeys;
  } else {
    groupOrders = [DEFAULT_KEY, ...groupOrders];
    groupsKeys.forEach((g) => {
      if (!groupOrders.find((go) => go === g)) {
        groupOrders.push(g);
      }
    });
  }

  const [isOpen, setIsOpenValue] = useState(false);
  const [selectedItem, setSelectedItem] = useState(initialItem);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const elRefs = useRef(new Map<string | number, any>());

  useEffect(() => {
    if (value !== selectedItem?.value) {
      const item = options.find((i) => {
        if (value) {
          return i.value === value;
        } else if (defaultValue) {
          return i.value === defaultValue;
        } else {
          return i.value === '';
        }
      });

      setSelectedItem(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleDocumentClick = useCallback((e) => {
    // Do nothing if clicking this component
    for (const node of dropdownRef.current.querySelectorAll('*')) {
      if (node == e.target) {
        return;
      }
    }
    // Close menu when clicking somewhere on the screen
    setIsOpenValue(false);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseDown = useCallback(
    throttle((e) => {
      setIsOpenValue((isOpen) => !isOpen);
      e.stopPropagation();
    }, 500),
    [],
  );

  const handleSelectValue = useCallback(
    (e: React.FormEvent<HTMLDivElement>, item: DropdownItem) => {
      e.stopPropagation();

      setSelectedItem(item);
      setIsOpenValue(false);
      onChange && onChange(item);
    },
    [onChange],
  );

  useEffect(() => {
    if (value !== selectedItem?.value) {
      const item = options.find((i) => {
        if (value) {
          return i.value === value;
        } else if (defaultValue) {
          return i.value === defaultValue;
        }
      });

      setSelectedItem(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    // Scroll to the selected item
    if (selectedItem && menuRef && menuRef.current) {
      const ref = elRefs.current.get(selectedItem.value);

      if (ref) {
        menuRef.current.scrollTop = ref.offsetTop;
      }
    }
  }, [isOpen, menuRef, selectedItem]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, false);
    document.addEventListener('touchend', handleDocumentClick, false);

    return function cleanup() {
      document.removeEventListener('click', handleDocumentClick, false);
      document.removeEventListener('touchend', handleDocumentClick, false);
    };
    // it's enough to call once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value !== selectedItem?.value) {
      const item = options.find((i) => {
        if (value) {
          return i.value === value;
        } else if (defaultValue) {
          return i.value === defaultValue;
        }
      });

      setSelectedItem(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <DropdownRoot ref={dropdownRef}>
      <DropdownControl height={height} hasError={hasError} onMouseDown={handleMouseDown} onTouchEnd={handleMouseDown}>
        {selectedItem && (
          <DropdownValue>
            <DropdownItem
              height={height}
              item={selectedItem}
              isLeftIconVisible={isLeftIconVisible ?? false}
              leftIconRenderer={leftIconRenderer}
            />
          </DropdownValue>
        )}
        {!selectedItem && <DropdownPlaceholder height={height}>{props?.placeholder}</DropdownPlaceholder>}
        <input ref={ref} type="hidden" name={name} value={selectedItem?.value ?? ''} />
        <DropdownArrow isOpen={isOpen} />
      </DropdownControl>
      {isOpen && (
        <DropdownMenu ref={menuRef}>
          {groupOrders.map((key) => {
            const group = groups.get(key);

            if (!group) {
              return undefined;
            }

            return (
              <React.Fragment key={key}>
                {key !== DEFAULT_KEY && (
                  <Box p={2} backgroundColor="#a9a9a9">
                    <TextLabel color="white" fontWeight="bold">
                      {key}
                    </TextLabel>
                  </Box>
                )}
                {group.map((item, idx) => (
                  <DropdownOption
                    ref={(ref) => {
                      ref && elRefs.current.set(item.value, ref);
                    }}
                    isSelected={selectedItem === item}
                    key={idx}
                    onMouseDown={(e) => handleSelectValue(e, item)}
                    onClick={(e) => handleSelectValue(e, item)}
                  >
                    <DropdownItem
                      height={height}
                      item={item}
                      isLeftIconVisible={isLeftIconVisible ?? false}
                      leftIconRenderer={leftIconRenderer}
                    />
                  </DropdownOption>
                ))}
              </React.Fragment>
            );
          })}
        </DropdownMenu>
      )}
    </DropdownRoot>
  );
});

Dropdown.displayName = 'Dropdown';

Dropdown.defaultProps = {
  isLeftIconVisible: false,
  height: '38px',
  hasError: false,
};

export default Dropdown;

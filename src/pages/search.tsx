import { ParsedUrlQuery } from 'querystring';
import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import { Controller } from 'react-hook-form';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import styled from 'styled-components';
import { theme } from '@components/global/theme';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import Grid from '@components/layouts/Grid';
import { Text } from '@components/atoms/Text';
import { withAuth, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, pickNotEmpty } from '@common/utils';
import InputSearch from '@components/organisms/InputSearch';
import ListingItemContainer from '@components/molecules/ListingItemContainer';
import ListingGridItemContainer from '@components/molecules/ListingGridItemContainer';
import { useSearchItems, SearchQuery } from '@services/hooks/item';
import { createApiClient } from '@services/core';
import { ItemApi, CategoryMasterApi, ProvinceMasterApi, BrandMasterApi } from '@services/apis';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { Button } from '@components/atoms/Button';
import { FormControl } from '@components/layouts/FormGroup';
import { SearchOrderTypes, ItemArrayResponse } from '@services/types';
import { TuneIcon, FormatListBulletedIcon, ViewModuleIcon, CloseIcon } from '@components/atoms/IconButton';
import SearchFormGroup, { SearchFormGroupValues, SearchItemStatus } from '@components/organisms/SearchFormGroup';
import { useGlobalOverflowContext } from '@contexts/GlobalOverflowContext';
import { TFunction } from 'next-i18next';
import Dropdown from '@components/molecules/Dropdown';
import Card from '@components/atoms/Card';
import breakpoints from '@components/global/breakpoints';
import { useSearchFormGroupState, SearchFormGroupState, validatePriceRange, SORT_OPTIONS } from '@services/hooks/SearchFormGroup';
import { pickFirstValueFromQuery, safeKey } from '@common/utils/functions';

const NUM_OF_ITEMS_PER_PAGE = 15;
const itemApi = createApiClient(ItemApi);
const categoryMasterApi = createApiClient(CategoryMasterApi);
const brandMasterApi = createApiClient(BrandMasterApi);
const provinceMasterApi = createApiClient(ProvinceMasterApi);

enum DesktopListingViewType {
  List = 'list',
  Grid = 'grid',
}

const SideBoxRoot = styled(Box)`
  background-color: #ffffff;
  overflow-y: auto;
  box-sizing: border-box;
`;

const formValueToQuery = (formValues: SearchFormGroupValues) => {
  const query: { [key: string]: string } = pickNotEmpty(
    {
      q: formValues.q,
      lowerBound: formValues.lowerBound,
      upperBound: formValues.upperBound,
      purchaseYear: formValues.purchaseYear,
      province: formValues.province,
      brand: formValues.brand,
      status: formValues.status === SearchItemStatus.Published || formValues.status === SearchItemStatus.Sold ? formValues.status : null,
    },
    true,
  );

  if (formValues.sorting) {
    query['sorting'] = formValues.sorting;
  }

  const categories: string[] = [];

  for (const key of Object.keys(formValues)) {
    const res = key.match(/categories\[(\d+)\]/);

    if (res && formValues[safeKey(key)]) {
      categories[safeKey(+res[1])] = formValues[safeKey(key)];
    }
  }
  if (categories.length > 0) {
    query['categories'] = categories.filter(Boolean).join(',');
  }

  return query;
};

const queryToFormValue = (
  query: ParsedUrlQuery,
  categories: string[],
  brandHashId: string,
  areaName: string,
  provinceHashId: string,
): SearchFormGroupValues => {
  const values: any = {
    q: pickFirstValueFromQuery(query.q),
    brand: brandHashId,
    area: areaName,
    province: provinceHashId,
  };

  const lowerBound = pickFirstValueFromQuery(query.lowerBound);
  const upperBound = pickFirstValueFromQuery(query.upperBound);

  if (validatePriceRange(lowerBound ?? '', upperBound ?? '')) {
    values['lowerBound'] = lowerBound;
    values['upperBound'] = upperBound;
  }

  const purchaseYear = pickFirstValueFromQuery(query.purchaseYear);

  if (+purchaseYear >= new Date().getFullYear() - 20) {
    values['purchaseYear'] = purchaseYear;
  }

  const status = pickFirstValueFromQuery(query.status);

  values['status'] = status === SearchItemStatus.Published || status === SearchItemStatus.Sold ? status : SearchItemStatus.Any;

  for (let i = 0; i < categories.length; ++i) {
    const key = `categories[${i}]`;

    values[safeKey(key)] = categories[safeKey(i)];
  }

  const sorting = pickFirstValueFromQuery(query.sorting);

  values['sorting'] = SORT_OPTIONS.find((s) => s.value === sorting) !== undefined ? sorting : SORT_OPTIONS[0].value;

  return pickNotEmpty(values, true) as SearchFormGroupValues;
};

const queryToSearchQuery = (query: ParsedUrlQuery) => {
  const searchQuery: Partial<SearchQuery> = {
    q: pickFirstValueFromQuery(query.q),
    lowerBoundPrice: pickFirstValueFromQuery(query.lowerBound),
    upperBoundPrice: pickFirstValueFromQuery(query.upperBound),
    purchaseYear: pickFirstValueFromQuery(query.purchaseYear),
    categoryIds: pickFirstValueFromQuery(query.categories),
    province: pickFirstValueFromQuery(query.province),
    brandId: pickFirstValueFromQuery(query.brand),
  };

  const sorting = pickFirstValueFromQuery(query.sorting);
  const sortingOptions = [SearchOrderTypes.HighestPrice, SearchOrderTypes.LowestPrice, SearchOrderTypes.Newest] as string[];

  if (sortingOptions.indexOf(sorting) !== -1) {
    searchQuery['sorting'] = sorting as SearchOrderTypes;
  }

  const status = pickFirstValueFromQuery(query.status);
  const statusOptions = [SearchItemStatus.Published, SearchItemStatus.Sold] as string[];

  if (statusOptions.indexOf(status) !== -1) {
    searchQuery['status'] = status as SearchItemStatus;
  }

  return searchQuery;
};

const SearchFormHeaderContainer = styled(Box)`
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
`;

const ClearFilterButtonContainer = styled(Flex)`
  cursor: pointer;
`;

interface SearchFormProps extends SearchFormGroupState {
  t: TFunction;
  onResetFilterClick: React.MouseEventHandler;
  isSortDropdownHidden?: boolean;
}

const SearchForm = (props: SearchFormProps) => {
  const { t, isSortDropdownHidden, onResetFilterClick, ...rest } = props;

  return (
    <Card backgroundColor={{ _: 'transparent', md: '#F0F4F7' }} height="auto" pb={2}>
      <SearchFormHeaderContainer px={3}>
        <Flex height="48px" width={1} alignItems="center">
          <Text mt={0} mb={0} fontSize="19px" lineHeight="23px" color="menuText" fontWeight="bold">
            {t('Filter')}
          </Text>
          <ClearFilterButtonContainer ml="auto" alignItems="center" onClick={onResetFilterClick}>
            <CloseIcon color="red" size="16px" />
            <Text mt={0} mb={0} ml={2} variant="small" color="red" fontFamily="secondary">
              {t('Clear filters')}
            </Text>
          </ClearFilterButtonContainer>
        </Flex>
      </SearchFormHeaderContainer>
      <Box mx={3} mt="20px">
        <FormControl>
          <SearchFormGroup {...rest} isSortDropdownHidden={isSortDropdownHidden} />
        </FormControl>
        <Box display={{ _: 'block', md: 'none' }}>
          <FormControl>
            <Button type="submit" variant="primary">
              {t('Apply')}
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Card>
  );
};

interface SearchPageProps extends WithTranslation {
  router: SingletonRouter;
  defaultItems: ItemArrayResponse;
  defaultExpectedTotal: number;
  defaultFormValues: SearchFormGroupValues;
}

const SearchBoxContainer = styled(Box)`
  border: solid #dddddd;
  border-width: 0px 1px 0px 0px;
`;

const SearchTitle = styled(Text)`
  word-break: break-all;
`;

const SearchPage: NextPage<SearchPageProps> = (props: SearchPageProps) => {
  const { t, router, defaultItems, defaultExpectedTotal, defaultFormValues } = props;
  const page = Number(router.query.page) || 1;

  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const { setGlobalOverflowY } = useGlobalOverflowContext();

  const onChangeValues = React.useCallback(
    (formValues: SearchFormGroupValues) => {
      const query = formValueToQuery(formValues);

      router.replace(
        {
          pathname: '/search',
          query,
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const [timer, setTimer] = React.useState<number | null>(null);

  const searchFormState = useSearchFormGroupState({
    categoryMasterApi,
    brandMasterApi,
    provinceMasterApi,
    defaultFormValues,
    onChange: React.useCallback(
      (values: SearchFormGroupValues) => {
        if (window.screen.width >= Number.parseInt(breakpoints.md)) {
          if (timer) {
            clearTimeout(timer);
          }

          setTimer(setTimeout(() => onChangeValues(values), 2000));
        }
      },
      [onChangeValues, setTimer, timer],
    ),
  });

  const { items, isLoading, error, expectedTotal, loadAndSetMoreItems } = useSearchItems({
    apiClient: itemApi,
    items: defaultItems,
    expectedTotal: defaultExpectedTotal,
    page,
    numOfItemsPerPage: NUM_OF_ITEMS_PER_PAGE,
    query: React.useMemo(() => queryToSearchQuery(router.query), [router.query]),
    onItemFetch: (page) => {
      router.replace(
        {
          pathname: '/search',
          query: pickNotEmpty({
            page: page,
            ...router.query,
          }),
        },
        undefined,
        { shallow: true },
      );
    },
  });

  const handleReachBottom = React.useCallback(() => {
    loadAndSetMoreItems();
  }, [loadAndSetMoreItems]);

  useEffect(() => {
    if (error) {
      setGlobalSnackbar({ message: t(error.message), variant: 'error' });
    }
  }, [t, error, setGlobalSnackbar]);

  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const onSearchIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsSearchBoxOpen((isSearchBoxOpen) => !isSearchBoxOpen);
    },
    [setIsSearchBoxOpen],
  );

  React.useEffect(() => {
    setGlobalOverflowY(isSearchBoxOpen ? 'hidden' : 'scroll');
  }, [isSearchBoxOpen, setGlobalOverflowY]);

  const onSubmit = React.useCallback(
    (data: SearchFormGroupValues) => {
      onChangeValues(data);
      setIsSearchBoxOpen(false);
    },
    [onChangeValues, setIsSearchBoxOpen],
  );

  const handleCancel = useCallback(() => {
    const formValues = searchFormState.formContext.getValues();
    const query: any =
      window.screen.width < Number.parseInt(breakpoints.md) ? { q: formValues.q } : { q: formValues.q, sorting: formValues.sorting };

    const newFormValues = {};

    for (const key of Object.keys(formValues)) {
      newFormValues[safeKey(key)] = key in query ? query[safeKey(key)] : null;
    }

    router.push(
      {
        pathname: '/search',
        query,
      },
      undefined,
      { shallow: true },
    );
    searchFormState.formContext.reset(newFormValues);
  }, [router, searchFormState]);

  const [desktopListingViewType, setDesktopListingViewType] = React.useState(DesktopListingViewType.List);

  const onResetFilterClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleCancel();
    },
    [handleCancel],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Search')}</title>
      </Head>
      <form onSubmit={searchFormState.formContext.handleSubmit(onSubmit)}>
        <Box position="relative">
          <Box
            display={{ _: 'block', md: 'none' }}
            borderBottom={`1px solid ${theme.colors.border}`}
            position="sticky"
            top={0}
            height="100%"
            backgroundColor={'#fff'}
            zIndex={1200}
          >
            <Flex alignItems="center">
              <SearchBoxContainer width="100%">
                <InputSearch
                  ref={searchFormState.formContext.register}
                  name="q"
                  placeholder={t('Search by Listing ID, brand, model')}
                  hasBorder={false}
                  onCancel={handleCancel}
                />
              </SearchBoxContainer>
              <Flex width="50px" justifyContent="center">
                <TuneIcon size="20px" color="text" onClick={onSearchIconClick} />
              </Flex>
            </Flex>
            <SideBoxRoot display={{ _: isSearchBoxOpen ? 'block' : 'none', md: 'none' }} width="100%" height="calc(100vh - 40px)" pb="70px">
              <SearchForm {...searchFormState} t={t} onResetFilterClick={onResetFilterClick} />
            </SideBoxRoot>
          </Box>

          <Container padding={{ _: 3, md: 0 }} pt={{ _: 3, md: '38px' }} pb={{ _: 3, md: 3 }}>
            <Box display={{ _: 'block', md: 'none' }}>
              {expectedTotal > 0 && (
                <Text mt={0} variant="mediumLarge">
                  {t('{{expectedTotal}} results found', { expectedTotal })}
                </Text>
              )}
              <ListingItemContainer items={items} isLoading={isLoading} expectedTotal={expectedTotal} onReachBottom={handleReachBottom} />
            </Box>

            <Box display={{ _: 'none', md: 'block' }} width="1100px" mx="auto">
              <Grid display="grid" gridTemplateColumns="250px 1fr" gridGap={3}>
                <Box width="250px">
                  {defaultFormValues.q !== undefined && defaultFormValues.q !== null && (
                    <SearchTitle
                      mt={0}
                      mb={0}
                      variant="extraLarge"
                      color="text"
                      fontWeight="bold"
                    >{`Searching '${defaultFormValues.q}'`}</SearchTitle>
                  )}
                </Box>
                <Flex height="37px" alignItems="center">
                  <Text mt={0} mb={0} variant="mediumLarge" fontFamily="secondary">
                    {t('{{expectedTotal}} results found', { expectedTotal })}
                  </Text>
                  <Flex ml="auto" alignItems="center">
                    <Text mb={0} mt={0} color="text" fontSize="17px" lineHeight="27px" letterSpacing="0.08px" fontWeight="bold">
                      {t(`Sort by`)}
                    </Text>
                    <Box ml="9px" width="180px">
                      <Controller
                        as={<Dropdown options={searchFormState.sortOptions} placeholder={t('Select Order')} />}
                        name="sorting"
                        control={searchFormState.formContext.control}
                        onChange={(changes) => {
                          return changes.length > 0 ? changes[0].value : undefined;
                        }}
                      />
                    </Box>
                    <Box ml="26px">
                      <Grid display="grid" gridGap={3} gridTemplateColumns={'repeat(2, auto)'}>
                        <FormatListBulletedIcon
                          color={desktopListingViewType === DesktopListingViewType.List ? 'text' : 'unselected'}
                          onClick={() => setDesktopListingViewType(DesktopListingViewType.List)}
                        />
                        <ViewModuleIcon
                          color={desktopListingViewType === DesktopListingViewType.Grid ? 'text' : 'unselected'}
                          onClick={() => setDesktopListingViewType(DesktopListingViewType.Grid)}
                        />
                      </Grid>
                    </Box>
                  </Flex>
                </Flex>
              </Grid>
              <Grid width="100%" display="grid" gridTemplateColumns="250px 1fr" gridGap={3} mt={3}>
                <Box>
                  <SearchForm {...searchFormState} t={t} onResetFilterClick={onResetFilterClick} isSortDropdownHidden={true} />
                </Box>
                <Box>
                  {desktopListingViewType === DesktopListingViewType.List && (
                    <ListingItemContainer
                      items={items}
                      isLoading={isLoading}
                      expectedTotal={expectedTotal}
                      onReachBottom={handleReachBottom}
                    />
                  )}
                  {desktopListingViewType === DesktopListingViewType.Grid && (
                    <ListingGridItemContainer
                      items={items}
                      isLoading={isLoading}
                      expectedTotal={expectedTotal}
                      onReachBottom={handleReachBottom}
                    />
                  )}
                </Box>
              </Grid>
            </Box>
          </Container>
        </Box>
      </form>
    </Layout>
  );
};

SearchPage.displayName = 'SearchPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async (ctx: GetServerSidePropsContext<{}>) => {
  try {
    const selectedCategoriesQuery = (pickFirstValueFromQuery(ctx.query.categories) ?? '').split(',').filter(Boolean);
    const brandQuery = pickFirstValueFromQuery(ctx.query.brand);
    const provinceQuery = pickFirstValueFromQuery(ctx.query.province);

    const defaultFormValues = queryToFormValue(ctx.query, selectedCategoriesQuery, brandQuery, '', provinceQuery);

    const page = Number(ctx.query.page) || 1;
    const itemApi = createApiClient(ItemApi, ctx);

    const [defaultItems, defaultExpectedTotal] = await itemApi.search({
      ...pickNotEmpty(
        {
          page: page,
          perPage: NUM_OF_ITEMS_PER_PAGE,
          q: defaultFormValues.q,
          lowerBoundPrice: defaultFormValues.lowerBound,
          upperBoundPrice: defaultFormValues.upperBound,
          purchaseYear: defaultFormValues.purchaseYear,
          categoryIds: selectedCategoriesQuery.join(','),
          province: provinceQuery,
          brandId: brandQuery,
          status: defaultFormValues.status,
        },
        true,
      ),
      sort: defaultFormValues.sorting,
    });

    return {
      props: {
        namespacesRequired: ['common'],
        defaultItems,
        defaultExpectedTotal,
        defaultFormValues,
      },
    };
  } catch (err) {
    console.log(err);
    const statusCode = err.statusCode || 500;

    ctx.res.statusCode = statusCode;

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], SearchPage);

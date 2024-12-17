import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose, pickNotEmpty, safeKey } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { createApiClient } from '@services/core';
import { ItemApi, FileApi, CategoryMasterApi, BrandMasterApi, ModelMasterApi } from '@services/apis';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import InputText from '@components/molecules/InputText';
import { ErrorOutlineIcon } from '@components/atoms/IconButton';
import FormOutline from '@components/molecules/FormOutline';
import Dropdown, { DropdownItem } from '@components/molecules/Dropdown';
import { ImageData } from '@components/molecules/InputImages';
import {
  FileCategory,
  FilePermission,
  ItemResponse,
  CreateItemRequest,
  EditItemRequest,
  BrandResponse,
  CategoryArrayResponse,
  ModelResponse,
} from '@services/types';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { getItemData } from '@services/facades/item';
import InputImageController from '@components/organisms/InputImageController';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import Annotation from '@components/molecules/Annotation';
import Image from '@components/atoms/Image';
import { uploadImageIfNotUploaded } from '@services/facades/file';
import { useCategoryMaster } from '@services/hooks/category-master';
import { useBrandMaster } from '@services/hooks/brand-master';
import { useModelMaster } from '@services/hooks/model-master';
import { useValueChangeDetector, useScrollToError } from '@common/utils/hooks';
import InputHelperText from '@components/atoms/InputHelperText';

const itemApi = createApiClient(ItemApi);
const fileApi = createApiClient(FileApi);
const categoryMasterApi = createApiClient(CategoryMasterApi);
const brandMasterApi = createApiClient(BrandMasterApi);
const modelMasterApi = createApiClient(ModelMasterApi);

// Lower limit for productionYear and Purchase Year
const currentyear = new Date().getFullYear();
const yearList = Array.from(new Array(40), (_val, index) => currentyear - index).map((y) => ({
  label: `A.D. ${y} / พ.ศ. ${y + 543}`,
  value: y.toString(),
}));

enum SubmitType {
  SaveAsDraft = 'SAVE_AS_DRAFT',
  Submit = 'SUBMIT',
}

const getCategoriesFromFormValue = (formValues: FormState) => {
  const categories: string[] = [];

  for (const key of Object.keys(formValues)) {
    const res = key.match(/categories\[(\d+)\]/);

    if (res) {
      categories[safeKey(+res[1])] = formValues[safeKey(key)];
    }
  }

  return categories.filter(Boolean);
};

const getCategoryHashIdForBrands = (categories: CategoryArrayResponse[], selectedCategories: string[]) => {
  const mainCategory = (categories[0] ?? []).find((cat) => cat.hashId === selectedCategories[0]);

  if (mainCategory?.englishName === 'Truck') {
    return selectedCategories.length > 1 ? selectedCategories[1] : selectedCategories[0];
  }

  return selectedCategories[selectedCategories.length - 1];
};

interface FormState {
  submitType: string;
  brand: string;
  model: string;
  productionYear: string;
  usage: string;
  purchaseYear?: string;
  licencePlate?: string;
  vin?: string;
  vehicleRegistrationBookFile?: ImageData;
  categories?: string[];
}

interface ListingAddIndexProps extends WithTranslation {
  router: SingletonRouter;
  item?: ItemResponse;
  years: string[];
}

// eslint-disable-next-line complexity
const ListingAddIndex: NextPage<ListingAddIndexProps> = (props: ListingAddIndexProps) => {
  const { t, i18n, router, item } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const defaultSelectedCategories = React.useMemo(
    () => (item?.category ? item.category.parentHashIds.concat([item.category.hashId]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const defaultValues = React.useMemo(() => {
    const defaultValues = {
      brand: null,
      model: item?.model?.hashId,
      productionYear: item?.productionYear?.toString() || '',
      usage: item?.usage?.toString() || '',
      purchaseYear: item?.purchaseYear?.toString() || '',
      licencePlate: item?.licencePlate || '',
      vin: item?.vin || '',
      vehicleRegistrationBookFile: item?.vehicleRegistrationBookFile
        ? {
            src: item?.vehicleRegistrationBookFile.url,
            hashId: item?.vehicleRegistrationBookFile.hashId,
          }
        : undefined,
    };

    defaultSelectedCategories.forEach((categoryHashId: string, index: number) => {
      defaultValues[safeKey(`categories[${index}]`)] = categoryHashId;
    });

    return defaultValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, errors, control, getValues, reset, formState, watch } = useForm<FormState>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { scrollToError } = useScrollToError();

  React.useEffect(() => {
    scrollToError(errors);
  }, [scrollToError, errors]);

  const [submitType, setSubmitType] = React.useState(null);
  const onSaveDraftButtonClick = React.useCallback(() => setSubmitType(SubmitType.SaveAsDraft), [setSubmitType]);
  const onSubmitButtonClick = React.useCallback(() => setSubmitType(SubmitType.Submit), [setSubmitType]);

  const modelMaster = useModelMaster({
    modelMasterApi,
    defaultSelectedBrand: item?.brand?.hashId,
    defaultSelectedModel: item?.model?.hashId,
    onSelectedModelChange: React.useCallback(
      (model: ModelResponse) => {
        reset({
          ...getValues(),
          model: model?.hashId ?? null,
        });
      },
      [getValues, reset],
    ),
  });

  const brandMaster = useBrandMaster({
    brandMasterApi,
    defaultSelectedCategory: defaultSelectedCategories[defaultSelectedCategories.length - 1],
    defaultSelectedBrand: null,
    onSelectedBrandChange: React.useCallback(
      (brand: BrandResponse) => {
        reset({
          ...getValues(),
          brand: brand?.hashId ?? null,
        });
        if (modelMaster.isInitializeDataLoaded) {
          modelMaster.updateSelectedBrand(brand?.hashId ?? null);
        }
      },
      [getValues, reset, modelMaster],
    ),
  });

  let categoryMaster: ReturnType<typeof useCategoryMaster>;

  // eslint-disable-next-line prefer-const
  categoryMaster = useCategoryMaster({
    categoryMasterApi,
    defaultSelectedCategories: defaultSelectedCategories,
    onSelectedCategoriesChange: React.useCallback(
      (selectedCategories: CategoryArrayResponse) => {
        const selectedCategoryHashIds = selectedCategories.map((cat) => cat.hashId);

        const formValues = getValues();

        const keys = new Set([
          ...Object.keys(formValues)
            .map((key) => {
              const res = key.match(/categories\[(\d+)\]/);

              if (res) {
                return +res[1];
              }
            })
            .filter((key) => key !== undefined),
          ...new Array(selectedCategories.length).fill(null).map((_, i) => i),
        ]);

        for (const key of Array.from(keys)) {
          formValues[safeKey(`categories[${key}]`)] = selectedCategories[safeKey(key)]?.hashId ?? null;
        }
        reset(formValues);

        const categoryHashIdForBrandMaster = getCategoryHashIdForBrands(categoryMaster.categoriesList, selectedCategoryHashIds);

        brandMaster.updateSelectedCategory(categoryHashIdForBrandMaster);
      },
      [getValues, reset, categoryMaster, brandMaster],
    ),
  });

  React.useEffect(() => {
    (async () => {
      if (categoryMaster.isInitializeDataLoaded) {
        const categoryHashIdForBrandMaster = getCategoryHashIdForBrands(categoryMaster.categoriesList, categoryMaster.selectedCategories);

        await brandMaster.updateSelectedCategory(categoryHashIdForBrandMaster);
        reset({
          ...getValues(),
          brand: item?.brand?.hashId ?? null,
        });
        brandMaster.updateSelectedBrand(item?.brand?.hashId);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryMaster.isInitializeDataLoaded]);

  const formValues = watch();

  const selectedCategories = React.useMemo(() => getCategoriesFromFormValue(formValues), [formValues]);

  useValueChangeDetector(
    selectedCategories,
    React.useCallback(
      (categoryHashIds: string[]) => {
        if (categoryMaster.isInitializeDataLoaded) {
          categoryMaster.updateSelectedCategories(categoryHashIds);
        }

        if (brandMaster.isInitializeDataLoaded) {
          const categoryHashIdForBrandMaster = getCategoryHashIdForBrands(categoryMaster.categoriesList, categoryHashIds);

          brandMaster.updateSelectedCategory(categoryHashIdForBrandMaster);
        }
      },
      [categoryMaster, brandMaster],
    ),
  );

  useValueChangeDetector(
    watch(['brand']),
    React.useCallback(
      ({ brand = null }) => {
        if (brandMaster.isInitializeDataLoaded) {
          brandMaster.updateSelectedBrand(brand);

          if (modelMaster.isInitializeDataLoaded) {
            modelMaster.updateSelectedBrand(brand);
          }
        }
      },
      [modelMaster, brandMaster],
    ),
  );

  useValueChangeDetector(
    watch(['model']),
    React.useCallback(
      ({ model = null }) => {
        if (modelMaster.isInitializeDataLoaded) {
          modelMaster.updateSelectedModel(model);
        }
      },
      [modelMaster],
    ),
  );

  const onSubmit = React.useCallback(
    async (data: FormState) => {
      setGlobalSpinner(true);
      let newVehicleRegistrationBookFile: ImageData | null = null;

      try {
        if (data.vehicleRegistrationBookFile) {
          newVehicleRegistrationBookFile = await uploadImageIfNotUploaded(fileApi, data.vehicleRegistrationBookFile, {
            category: FileCategory.Item,
            permission: FilePermission.Private,
          });
        }

        const { result, isNew } = await (async () => {
          const requestData = pickNotEmpty({
            categoryHashId: data.categories[data.categories.length - 1],
            brandHashId: data.brand,
            modelHashId: data.model,
            productionYear: Number(data.productionYear),
            usage: data.usage,
            purchaseYear: data.purchaseYear ? Number(data.purchaseYear) : null,
            licencePlate: data.licencePlate,
            vin: data.vin,
            vehicleRegistrationBookFileHashId: newVehicleRegistrationBookFile?.hashId,
          });

          if (item && item.hashId) {
            const result = await itemApi.editItem(item.hashId, requestData as EditItemRequest);

            return { result, isNew: false };
          } else {
            const result = await itemApi.createItem(requestData as CreateItemRequest);

            return { result, isNew: true };
          }
        })();

        if (submitType === SubmitType.SaveAsDraft) {
          setGlobalSnackbar({ message: t('Your listing has been saved as draft'), variant: 'success' });
          router.replace(
            {
              pathname: '/listing/add',
              query: { hashId: result.hashId },
            },
            undefined,
            { shallow: !isNew },
          );
        } else {
          router.push(`/listing/add/${encodeURIComponent(result.hashId)}/details`);
        }
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        const resetFormData = pickNotEmpty(
          {
            ...data,
            vehicleRegistrationBookFile: newVehicleRegistrationBookFile,
            categories: undefined,
          },
          true,
        );

        data.categories.forEach((categoryHashId: string, index: number) => {
          resetFormData[safeKey(`categories[${index}]`)] = categoryHashId;
        });

        reset(resetFormData);
        setGlobalSpinner(false);
      }
    },
    [t, reset, submitType, item, setGlobalSnackbar, setGlobalSpinner, router],
  );

  const categoryDoubleOptions = React.useMemo(
    () =>
      categoryMaster.categoriesList.map((categories) =>
        categories.map((category) => ({
          value: category.hashId,
          label: t(category.englishName),
        })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryMaster.categoriesList, i18n.language],
  );

  const brandOptions = React.useMemo(
    () =>
      brandMaster.brands.map((brand) => ({
        value: brand.hashId,
        label: t(brand.name),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brandMaster.brands, i18n.language],
  );

  const modelOptions = React.useMemo(
    () =>
      modelMaster.models.map((model) => ({
        value: model.hashId,
        label: t(model.name),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelMaster.models, i18n.language],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Create a listing')}</title>
      </Head>

      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={0}
            title={t(`Create a listing`)}
            steps={[t('Vehicle details'), t('Listing details'), t('Preview & Publish')]}
          />
        </Box>
        <Box display={{ _: 'none', md: 'block' }} ml="auto" my="auto" width="160px">
          <Button variant="transparent" type="submit" onClick={onSaveDraftButtonClick}>
            {t(`Save as draft`)}
          </Button>
        </Box>
      </FormHeaderContainer>

      <Container width={{ _: 1, md: '968px' }} mx={{ _: 0, md: 'auto' }} mt={{ _: 0, md: '40px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormOutline
              outline={t(`Vehicle type`)}
              icon={<ErrorOutlineIcon size="16px" color="helpIcon" tooltip="Please specify vehicle specs" />}
            />
            <ResponsiveFormContainer mt={3} mb={0}>
              <ResponsiveFormItem>
                <Text my={0} variant="small">
                  {t(`Category`)}
                </Text>
                {categoryDoubleOptions.map((categoryOptions: DropdownItem[], index: number) => {
                  const placeholder = index === 0 ? t('e.g. Truck') : null;
                  const error = (errors?.categories ?? [])[safeKey(index)];

                  return (
                    <FormControl key={index}>
                      <Controller
                        as={<Dropdown placeholder={placeholder} options={categoryOptions} hasError={!!error} />}
                        name={`categories[${index}]`}
                        control={control}
                        onChange={(changes) => {
                          return changes.length > 0 ? changes[0].value : undefined;
                        }}
                        defaultValue={getValues(`categories[${index}]`)}
                        rules={{
                          required: { value: true, message: `${t(`Category`)} ${t(`is required`)}` },
                        }}
                      />
                      {error && <InputHelperText hasError={true}>{error.message}</InputHelperText>}
                    </FormControl>
                  );
                })}
              </ResponsiveFormItem>
              <ResponsiveFormDescription>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Annotation title={t('Help title')}>
                    <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                      {t('Please avoid shadows and blurry images.')}
                    </Text>
                  </Annotation>
                </Box>
              </ResponsiveFormDescription>
            </ResponsiveFormContainer>
          </FormGroup>

          <FormGroup>
            <FormOutline outline={t(`General details`)} />
            <ResponsiveFormContainer mt={3} mb={0}>
              <ResponsiveFormItem>
                <FormControl>
                  <Text my={0} variant="small">
                    {t(`Brand`)}
                  </Text>
                  <Controller
                    as={<Dropdown placeholder={t('e.g. Isuzu')} hasError={!!errors.brand} options={brandOptions} />}
                    name="brand"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0].value : undefined;
                    }}
                    defaultValue={getValues('brand')}
                    rules={{
                      required: { value: true, message: `${t(`Brand`)} ${t(`is required`)}` },
                    }}
                  />
                  {errors.brand && <InputHelperText hasError={true}>{errors.brand.message}</InputHelperText>}
                </FormControl>

                <FormControl mt={3} mb={0}>
                  <Text my={0} variant="small">
                    {t(`Model`)}
                  </Text>
                  <Controller
                    as={<Dropdown placeholder={t('e.g. D-Max')} hasError={!!errors.model} options={modelOptions} />}
                    name="model"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0].value : undefined;
                    }}
                    defaultValue={getValues('model')}
                    rules={{
                      required: { value: true, message: `${t(`Model`)} ${t(`is required`)}` },
                    }}
                  />
                  {errors.model && <InputHelperText hasError={true}>{errors.model.message}</InputHelperText>}
                </FormControl>

                <FormControl mt={3} mb={0}>
                  <Text my={0} variant="small">
                    {t(`Production year`)}
                  </Text>
                  <Controller
                    as={<Dropdown placeholder={t('e.g. A.D. 2020 / พ.ศ. 2563')} hasError={!!errors.productionYear} options={yearList} />}
                    name="productionYear"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0].value : undefined;
                    }}
                    defaultValue={getValues('productionYear')}
                    rules={{
                      required: {
                        value: true,
                        message: `${t(`Production year`)} ${t(`is required.`)}`,
                      },
                    }}
                  />
                  {errors.productionYear && <InputHelperText hasError={true}>{errors.productionYear.message}</InputHelperText>}
                </FormControl>
              </ResponsiveFormItem>
              <ResponsiveFormDescription>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Annotation title={t('Help title')}>
                    <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                      {t('Please avoid shadows and blurry images.')}
                    </Text>
                  </Annotation>
                </Box>
              </ResponsiveFormDescription>
            </ResponsiveFormContainer>
          </FormGroup>

          <FormGroup>
            <ResponsiveFormContainer mt={3} mb={0}>
              <ResponsiveFormItem>
                <FormControl mt={3} mb={0}>
                  <InputText
                    ref={register({
                      required: { value: true, message: `${t(`Usage`)} ${t(`is required`)}` },
                      validate: (usage: string) => {
                        const numUsage = +usage;

                        if (numUsage === NaN) {
                          return `${t('Please input correct format')}`;
                        }

                        if (numUsage < 0) {
                          return `${t('Please input positive number')}`;
                        }

                        return true;
                      },
                    })}
                    type="number"
                    name="usage"
                    label={t('Usage (Km)')}
                    placeholder={t(`e.g. 75,000`)}
                    hasError={!!errors.usage}
                    helperText={errors.usage && `${t(`Usage`)} ${t('is required')}`}
                  />
                </FormControl>
              </ResponsiveFormItem>
              <ResponsiveFormDescription>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Annotation title={t('Help title')}>
                    <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                      {t('Please avoid shadows and blurry images.')}
                    </Text>
                  </Annotation>
                </Box>
              </ResponsiveFormDescription>
            </ResponsiveFormContainer>
          </FormGroup>

          <FormGroup>
            <FormOutline outline={t(`Background details (Optional)`)} />
            <ResponsiveFormContainer mt={2} mb={0}>
              <ResponsiveFormItem>
                <FormControl mt={2} mb={0}>
                  <Text my={0} color="darkGrey" fontFamily="secondary">
                    {t(
                      `These details will not be shown. These details are collected in order to comply with anti-theft and anti-fraud regulations.`,
                    )}
                  </Text>
                </FormControl>

                <FormControl mt={3} mb={0}>
                  <InputText
                    ref={register({ required: false })}
                    type="text"
                    name="licencePlate"
                    label={t(`Licence plate`)}
                    placeholder={t(`e.g. กข 1234`)}
                    hasError={!!errors.licencePlate}
                    helperText={errors.licencePlate && `${t(`Licence plate`)} ${t('is required')}`}
                  />
                </FormControl>

                <FormControl mt={3} mb={0}>
                  <InputText
                    ref={register({ required: false })}
                    type="text"
                    name="vin"
                    label={t(`Vehicle identification number (VIN)`)}
                    placeholder={t(`e.g. HGFD12345678645342312435`)}
                    hasError={!!errors.vin}
                    helperText={errors.vin && `${t(`VIN`)} ${t('is required')}`}
                  />
                  <Box mt="9px">
                    <TextLink my={0} fontFamily="secondary">
                      {t(`Finding your VIN`)}
                    </TextLink>
                  </Box>
                </FormControl>

                <FormControl mt={3} mb={0}>
                  <Text my={0} variant="small">
                    {t(`Purchase year`)}
                  </Text>
                  <Controller
                    as={<Dropdown placeholder={t('e.g. A.D. 2020 / พ.ศ. 2563')} hasError={!!errors.purchaseYear} options={yearList} />}
                    name="purchaseYear"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0].value : undefined;
                    }}
                    defaultValue={getValues('purchaseYear')}
                    rules={{
                      required: {
                        value: false,
                        message: `${t(`Purchase year`)} ${t(`is required.`)}`,
                      },
                    }}
                  />
                  {errors.purchaseYear && <InputHelperText hasError={true}>{errors.purchaseYear.message}</InputHelperText>}
                </FormControl>
              </ResponsiveFormItem>
              <ResponsiveFormDescription>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Annotation title={t('Help title')}>
                    <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                      {t('Please avoid shadows and blurry images.')}
                    </Text>
                  </Annotation>
                </Box>
              </ResponsiveFormDescription>
            </ResponsiveFormContainer>
          </FormGroup>

          <FormGroup>
            <FormOutline outline={t(`Vehicle Registration Book`)} />
            <ResponsiveFormContainer mt="11px" mb={0}>
              <ResponsiveFormItem>
                <FormControl mt="11px">
                  <Controller
                    as={
                      <InputImageController
                        defaultImages={getValues('vehicleRegistrationBookFile') ? [getValues('vehicleRegistrationBookFile')] : []}
                        maximumNumber={1}
                      />
                    }
                    name="vehicleRegistrationBookFile"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0][0] : undefined;
                    }}
                    rules={{ required: false }}
                  />
                </FormControl>
                <Box display={{ _: 'block', md: 'none' }}>
                  <Text mt={0} mb={0} variant="small" lineHeight="20px" color="placeholder" fontFamily="secondary">
                    {t(`Please take a clear making sure to avoid blurry images and reflections.`)}
                  </Text>
                  <TextLink href="/static/images/sample/vehicle-reg-sample.png" mt={0} mb={0} color="link" fontFamily="secondary">
                    {t(`See example`)}
                  </TextLink>
                </Box>
              </ResponsiveFormItem>
              <ResponsiveFormDescription>
                <Box display={{ _: 'none', md: 'block' }}>
                  <Annotation title={t('Help title')}>
                    <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                      {t('Please avoid shadows and blurry images.')}
                    </Text>
                    <Image height={'245px'} src={`/static/images/listing/vehicle-registration-sample.png`} borderRadius="8px" />
                  </Annotation>
                </Box>
              </ResponsiveFormDescription>
            </ResponsiveFormContainer>
          </FormGroup>

          <Flex mt={{ _: 5, md: '78px' }} flexDirection={{ _: 'column', md: 'row' }}>
            <Box width={{ _: 1, md: '160px' }} ml={{ _: 0, md: 'auto' }}>
              <Button variant="transparent" type="submit" onClick={onSaveDraftButtonClick}>
                {t(`Save as draft`)}
              </Button>
            </Box>
            <Box mt={{ _: '15px', md: 0 }} width={{ _: 1, md: '246px' }} ml={{ _: 0, md: 3 }}>
              <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit" onClick={onSubmitButtonClick}>
                {t(`Continue`)}
              </Button>
            </Box>
          </Flex>
        </form>
      </Container>
    </Layout>
  );
};

ListingAddIndex.displayName = 'ListingAddIndex';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    if (!ctx.query.hashId) {
      return {
        props: {
          namespacesRequired: ['common'],
        },
      };
    }

    const { itemData } = await getItemData(ctx);

    return {
      props: {
        namespacesRequired: ['common'],
        item: itemData,
      },
    };
  } catch (err) {
    const statusCode = err.statusCode || 500;

    ctx.res.statusCode = statusCode;

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], ListingAddIndex);

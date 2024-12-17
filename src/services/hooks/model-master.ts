import React from 'react';
import { ModelMasterApi } from '@services/apis';
import { ModelResponse, ModelArrayResponse } from '@services/types';

export interface ModelMasterHooksProps {
  modelMasterApi: ReturnType<typeof ModelMasterApi>;
  defaultSelectedBrand: string;
  defaultSelectedModel: string;
  onSelectedModelChange?: (model: ModelResponse) => void;
}

export interface ModelMasterHooksState {
  models: ModelArrayResponse;
  selectedBrandHashId: string;
  selectedModelHashId: string;
  isInitializeDataLoaded: boolean;
}

export const useModelMaster = (props: ModelMasterHooksProps) => {
  const { modelMasterApi, defaultSelectedBrand, defaultSelectedModel, onSelectedModelChange } = props;

  const [state, setState] = React.useState<ModelMasterHooksState>({
    models: [],
    selectedBrandHashId: defaultSelectedBrand,
    selectedModelHashId: defaultSelectedModel,
    isInitializeDataLoaded: false,
  });

  React.useEffect(() => {
    (async () => {
      const models = defaultSelectedBrand ? await modelMasterApi.getModelsByBrandHashId(defaultSelectedBrand) : [];
      const selectedModel = models.find((m) => m.hashId === defaultSelectedModel);

      onSelectedModelChange(selectedModel ?? null);

      setState({
        models: models,
        selectedBrandHashId: defaultSelectedBrand,
        selectedModelHashId: selectedModel?.hashId ?? null,
        isInitializeDataLoaded: true,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelectedBrand = React.useCallback(
    async (brandHashId: string) => {
      const { selectedModelHashId } = state;

      const newModels = brandHashId ? await modelMasterApi.getModelsByBrandHashId(brandHashId) : [];
      const newSelectedModel = newModels.find((m) => m.hashId === selectedModelHashId);

      if (selectedModelHashId && !newSelectedModel) {
        onSelectedModelChange(null);
      }

      setState((prevState) => ({
        ...prevState,
        models: newModels,
        selectedBrandHashId: brandHashId,
        selectedModelHashId: newSelectedModel?.hashId ?? null,
      }));
    },
    [modelMasterApi, onSelectedModelChange, setState, state],
  );

  const updateSelectedModel = React.useCallback(
    (modelHashId: string) => {
      setState((prevState) => ({
        ...prevState,
        selectedModel: modelHashId,
      }));
    },
    [setState],
  );

  const { models, selectedModelHashId, isInitializeDataLoaded } = state;

  return {
    models,
    selectedModelHashId,
    updateSelectedBrand,
    updateSelectedModel,
    isInitializeDataLoaded,
  };
};

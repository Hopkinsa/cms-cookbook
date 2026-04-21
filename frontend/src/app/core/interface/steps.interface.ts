export type IStep = {
  is_title: boolean;
  step: string;
};

export type IStepUpdate = {
  is_title?: boolean;
  step?: string;
};

export const stepInitialState: IStep = {
  is_title: false,
  step: '',
};

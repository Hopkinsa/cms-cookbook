export interface IStep {
  is_title: boolean;
  step: string;
}

export interface IStepUpdate {
  is_title?: boolean;
  step?: string;
}

export const stepInitialState: IStep = {
  is_title: false,
  step: "",
}
export interface ITags {
  id: number;
  type: string;
  tag: string;
}

export const tagsInitialState: ITags = {
  id: -1,
  type: "",
  tag: ""
}
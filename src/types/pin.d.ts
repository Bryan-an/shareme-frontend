export interface IPinModel {
  image: IImage;
  _id: string;
  destination: string;
  postedBy: IPostedBy;
  save: ISave[] | null;
}

interface IImage {
  asset: IAsset;
}

interface IAsset {
  url: string;
}

interface IPostedBy {
  _id: string;
  userName: string;
  image: string;
}

interface ISave {
  userId: string;
  postedBy: IPostedBy;
}

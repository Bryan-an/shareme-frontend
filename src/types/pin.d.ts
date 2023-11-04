export interface IPinModel {
  image: IImage;
  _id: string;
  destination: string;
  postedBy: IPostedBy;
  save: ISave[] | null;
  category: string;
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

export interface IPinDetailModel {
  _id: string;
  image: SanityImageSource;
  about: string;
  category: string;
  save: ISave[] | null;
  title: string;
  destination: string;
  postedBy: IPostedBy;
  comments: IComment[] | null;
}

interface IComment {
  postedBy: IPostedBy;
  comment: string;
}

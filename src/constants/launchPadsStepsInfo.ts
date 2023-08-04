import { IStep } from "@components/StepsInfo";
import stepImg1 from "@public/images/steps/img1.png";
import stepImg2 from "@public/images/steps/img2.png";
import stepImg3 from "@public/images/steps/img3.png";
import stepImg4 from "@public/images/steps/img4.png";

export const stepsInfoList: IStep[] = [
  {
    stepTitle: "Step 1",
    subTitle: "Add your token details",
    bgImg: stepImg1.src,
    shape: "circle",
    topRight: true,
  },
  {
    stepTitle: "Step 2",
    subTitle: "Fill supply details",
    bgImg: stepImg2.src,
  },

  {
    stepTitle: "Step 3",
    subTitle: "Add social links",
    bgImg: stepImg3.src,
  },

  {
    stepTitle: "Step 4",
    subTitle: "Go live!",
    bgImg: stepImg4.src,
  },
];

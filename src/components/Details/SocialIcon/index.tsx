import { IconType } from "react-icons";

interface ISocialIcon {
  Icon: IconType;
  IconColor?: string;
  name?: string;
  Wrapper?: any;
  title?: string;
  url?: string;
  handleClick?: () => void;
}

const TITLE = "ParioPad";
const URL = "https://ctf-frontendprod.aticloud.atican.dev";

const SocialIcon: React.FC<ISocialIcon> = ({
  Icon,
  IconColor,
  name,
  Wrapper,
  title,
  url,
  handleClick,
}) => {
  return (
    <>
      {Wrapper ? (
        <Wrapper title={title} url={url}>
          <div
            className={`flex ${
              name ? "gap-2 items-center" : ""
            } shadow-md rounded-old-full cursor-pointer`}>
            <Icon color={IconColor} className="h-7 w-7" />
            {name && <span className="capitalize font-medium">{name}</span>}
          </div>
        </Wrapper>
      ) : (
        <div
          onClick={handleClick}
          className={`flex p-2 ${
            name ? "gap-2 items-center" : ""
          } shadow-md rounded-old-full cursor-pointer`}>
          <Icon className="h-7 w-7" />
          {name && <span className="capitalize font-medium">{name}</span>}
        </div>
      )}
    </>
  );
};

export default SocialIcon;

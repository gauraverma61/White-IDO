import CopyAddress from "../CopyAddress";

interface IAddressComp {
  addressType: string;
  address: string;
}

const AddressComp: React.FC<IAddressComp> = ({ addressType, address }) => {
  return (
    <div className="flex flex-wrap gap-2 text-base font-normal ">
      <p>{addressType} : </p>
      <CopyAddress
        addressClass={"text-red-text2"}
        address={address}
        iconSize={24}
      />
    </div>
  );
};

export default AddressComp;

import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@atoms/Button";
import CustomSwitch from "@molecules/Switch";
import { toast } from "react-toastify";
import * as Yup from "yup";
import moment from "moment/moment";
import { useFormik } from "formik";
import DateTimePicker from "@atoms/DateTimeInput";
import { DetailsType, IPoolDetailsData } from "@components/Details";

interface Props {
  data: IPoolDetailsData;
  showModal: boolean;
  setShowModal: Function;
  handleSubmit: Function;
  type?: DetailsType;
}

const SetTime: React.FC<Props> = ({
  showModal,
  setShowModal,
  handleSubmit,
  type,
  data,
}) => {
  const cancelButtonRef = useRef(null);
  const validations = Yup.object().shape({
    saleMethod: Yup.string().label("Sale method"),
    tier1EndTime: Yup.date()
      .label("Tier 1 end time")
      .test(
        "tier1EndTime",
        "Tier 1 end time should be greater than start time",
        (value, context) =>
          !value ||
          parseInt((value.getTime() / 1000).toFixed(0)) >= data.start_time
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 1 End Time Required"),
      }),
    tier2EndTime: Yup.date()
      .nullable()
      .label("Tier 2 end time")
      .test(
        "tier2EndTime",
        "Tier 2 end time should be greater than tier 1 end time and not more than presale end time",
        (value, context) =>
          !value ||
          (value > context.parent.tier1EndTime &&
            parseInt((value.getTime() / 1000).toFixed(0)) <= data.end_time)
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 2 End Time Required"),
      }),
    publicStartTime: Yup.date()
      .nullable()
      .label("Public Start TIme")
      .test(
        "publicStartTime",
        "Public start time should be greater than or equal to Tier 2 end time & Less than or equal to End time.",
        (value, context) =>
          !value ||
          (value >= context.parent.tier2EndTime &&
            parseInt((value.getTime() / 1000).toFixed(0)) <= data.end_time)
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 2 End Time Required"),
      }),
  });

  const formik = useFormik({
    initialValues: {
      saleMethod: "Public",
      tier1EndTime: "",
      tier2EndTime: "",
      publicStartTime: "",
    },
    validationSchema: validations,
    onSubmit: async (values, actions) => {
      // handleSubmit(values.)
      if (values.saleMethod === "Whitelist") {
        await handleSubmit(
          moment(values.tier1EndTime).utc().unix(),
          moment(values.tier2EndTime).utc().unix(),
          moment(values.publicStartTime).utc().unix()
        );
      } else {
        await handleSubmit(0, 0, 0);
      }
    },
  });

  const { values, setFieldValue } = formik;

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setShowModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform  bg-white text-left shadow-xl transition-all sm:my-8 max-w-[600px] w-full">
                <div className="bg-white px-5 sm:px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 text-center">
                      <span className="border-b border-[#000]">
                        Set Pool Time
                      </span>
                    </Dialog.Title>
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex px-5 sm:px-7  justify-center">
                  <form onSubmit={formik.handleSubmit}>
                    {(!type || type !== "fairlaunch") && (
                      <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                        <CustomSwitch
                          backGroundClass="bg-[#EB6D65]"
                          label="Sale Method"
                          options={["Public", "Whitelist"]}
                          selectedOption={values.saleMethod}
                          setSelectedOption={(v) => {
                            setFieldValue("saleMethod", v);
                          }}
                        />
                      </div>
                    )}

                    {formik.values.saleMethod === "Whitelist" && (
                      <>
                        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                          <DateTimePicker
                            label={`Tier 1 End Time (UTC)*`}
                            name="tier1EndTime"
                            value={formik.values.tier1EndTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier1EndTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier1EndTime &&
                              formik.errors.tier1EndTime
                            }
                          />
                        </div>
                        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                          <DateTimePicker
                            label={`Tier 2 End Time (UTC)*`}
                            name="tier2EndTime"
                            value={formik.values.tier2EndTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier2EndTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier2EndTime &&
                              formik.errors.tier2EndTime
                            }
                          />
                        </div>
                        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                          <DateTimePicker
                            label={`Public Start Time (UTC)*`}
                            name="publicStartTime"
                            value={formik.values.publicStartTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("publicStartTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.publicStartTime &&
                              formik.errors.publicStartTime
                            }
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-center w-full">
                      <Button
                        loading={formik.isSubmitting}
                        type={"submit"}
                        className={`w-full sm:w-56 disabled:opacity-50 ${
                          Object.keys(formik.errors).length != 0
                            ? "opacity-50"
                            : ""
                        }`}>
                        {" "}
                        Set Time
                      </Button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SetTime;

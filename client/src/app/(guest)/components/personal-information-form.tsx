import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  formInputs,
  specialRequest,
} from '@/app/(guest)/model/customer-information';
import { ReservationContext } from '@/context/ReservationContext';
import { useContext, useState } from 'react';

class InvalidPatternInfo {
  errorMessage = '';
  isInvalidPattern = false;

  constructor(errorMessage: string, isInvalidPattern: boolean) {
    this.errorMessage = errorMessage;
    this.isInvalidPattern = isInvalidPattern;
  }

  setIsInvalidPattern(status: boolean) {
    this.isInvalidPattern = status;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}

export default function PersonalInformationForm() {
  const { addInformation, information, setState, state } =
    useContext(ReservationContext);
  const { personalInformation } = information;
  const [isChange, setIsChange] = useState(false);
  const [invalidPatternInfos, setInvalidPatternInfos] = useState<
    InvalidPatternInfo[]
  >(
    Array.from(
      { length: formInputs.length },
      (_, index) =>
        new InvalidPatternInfo(formInputs[index].errorMessage || '', false)
    )
  );
  const [canPass, setCanPass] = useState(true);

  const btnClass = `bg-primary w-full rounded-lg  hover:bg-gray-800 active:bg-gray-800
                    p-4 my-4 hover:bg-primary-hover 
                    font-bold text-white`;

  const onSubmitHandler = (e: any) => {
    e.preventDefault();

    if (!canPass) {
      return;
    }

    const personalInformation = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      address: e.target[2].value,
      province: e.target[3].value,
      district: e.target[4].value,
      subDistrict: e.target[5].value,
      postcode: e.target[6].value,
      phoneNumber: e.target[7].value,
      email: e.target[8].value,
      specialRequests: e.target[9].value,
    };

    addInformation({ personalInformation });

    setIsChange(false);

    if (state != 4) {
      setState(4);
    }
  };

  const checkPattern = (
    pattern: string,
    value: string,
    errorMessage: string,
    index: number
  ) => {
    const regex = new RegExp(pattern);
    const newInvalidPatternInfos = [...invalidPatternInfos];
    if (!regex.test(value)) {
      newInvalidPatternInfos[index].setIsInvalidPattern(true);

      setInvalidPatternInfos(newInvalidPatternInfos);
    } else {
      newInvalidPatternInfos[index].setIsInvalidPattern(false);

      setInvalidPatternInfos(newInvalidPatternInfos);
    }
  };

  const checkSpecialRequest = (value: string, pattern: string) => {
    const regex = new RegExp(pattern);
    const newInvalidPatternInfos = [...invalidPatternInfos];

    if (!regex.test(value)) {
      setCanPass(false);

      newInvalidPatternInfos[9].setIsInvalidPattern(true);

      setInvalidPatternInfos(newInvalidPatternInfos);
    } else {
      setCanPass(true);

      newInvalidPatternInfos[9].setIsInvalidPattern(false);

      setInvalidPatternInfos(newInvalidPatternInfos);
    }
  };

  return (
    <form
      className="my-4 flex flex-col
                 md:flex-row md:w-full md:gap-10"
      onSubmit={(e) => onSubmitHandler(e)}
    >
      <div className="md:w-1/2 flex flex-col gap-2 ">
        {formInputs.slice(0, 6).map((input, index) => (
          <div key={index}>
            <div className="flex items-center justify-between px-2">
              <Label htmlFor={input.id}>
                {input.label} <span className="text-red-500"> *</span>
              </Label>

              <h1
                className={`${
                  invalidPatternInfos[index].isInvalidPattern
                    ? 'text-red-500'
                    : 'text-gray-400'
                } text-xs font-bold`}
              >
                {invalidPatternInfos[index].errorMessage}
              </h1>
            </div>
            <Input
              type={input.type}
              id={input.id}
              placeholder={input.placeHolder}
              name={input.name}
              className="my-2"
              required={input.required}
              onChange={(e) => {
                setIsChange(true);
                checkPattern(
                  input.pattern!,
                  e.target.value,
                  input.errorMessage!,
                  index
                );
              }}
              defaultValue={
                personalInformation ? personalInformation[input.key] : ''
              }
              maxLength={input.max}
              pattern={input.pattern}
            />
          </div>
        ))}
      </div>

      <div className="md:w-1/2 flex-grow flex flex-col gap-2">
        {formInputs.slice(6, 9).map((input, index) => {
          const shiftedIndex = index + 6;
          return (
            <div key={shiftedIndex}>
              <div className="flex items-center justify-between px-2">
                <Label htmlFor={input.id}>
                  {input.label} <span className="text-red-500"> *</span>
                </Label>

                <h1
                  className={`${
                    invalidPatternInfos[shiftedIndex].isInvalidPattern
                      ? 'text-red-500'
                      : 'text-gray-400'
                  } text-xs font-bold`}
                >
                  {invalidPatternInfos[shiftedIndex].errorMessage}
                </h1>
              </div>
              <Input
                type={input.type}
                id={input.id}
                placeholder={input.placeHolder}
                name={input.name}
                className="my-2"
                required={input.required}
                onChange={(e) => {
                  setIsChange(true);
                  checkPattern(
                    input.pattern!,
                    e.target.value,
                    input.errorMessage!,
                    shiftedIndex
                  );
                }}
                defaultValue={
                  personalInformation ? personalInformation[input.key] : ''
                }
                maxLength={input.max}
              />
            </div>
          );
        })}
        <div className="md:flex-grow md:flex md:flex-col md:my-2 md:gap-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <Label htmlFor="special-request" className="whitespace-nowrap">
              Special Requests
            </Label>
            <h1
              className={`${
                invalidPatternInfos[9].isInvalidPattern
                  ? 'text-red-500'
                  : 'text-gray-400'
              } text-xs font-bold mx-4`}
            >
              {invalidPatternInfos[9].errorMessage}
            </h1>
          </div>
          <Textarea
            placeholder="Type your message here."
            className="md:flex-grow"
            onChange={(e) => {
              setIsChange(true);
              checkSpecialRequest(e.target.value, specialRequest.pattern);
            }}
            defaultValue={
              personalInformation ? personalInformation.specialRequests : ''
            }
          />
        </div>

        <Button
          className={btnClass}
          type="submit"
          disabled={!isChange && state == 4}
        >
          {state == 4 ? 'Confirm Edit' : 'Confirm'}
        </Button>
      </div>
    </form>
  );
}

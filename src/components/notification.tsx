import { TAlertDangerProps } from "../utils/types/auth.type";

export const AlertDanger = ({ msg }: TAlertDangerProps) => {
  return (
    <div
      className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-400 "
      role="alert"
    >
      <span className="font-medium">Maaf password anda salah !</span> {msg}
    </div>
  );
};

export const AlertSuccess = () => {
  return (
    <div
      className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-400 "
      role="alert"
    >
      <span className="font-medium">Login Success</span>
    </div>
  );
};

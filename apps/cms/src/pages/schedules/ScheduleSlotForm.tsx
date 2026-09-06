import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ScheduleSlot, ScheduleSlotInput, Weekday } from "@/types/schedule";

const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface ScheduleSlotFormProps {
  slot?: ScheduleSlot | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: ScheduleSlotInput) => void;
}

export default function ScheduleSlotForm({
  slot,
  saving = false,
  onClose,
  onSubmit,
}: ScheduleSlotFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState<Weekday>(
    slot?.dayOfWeek ?? "monday",
  );
  const [startTime, setStartTime] = useState(slot?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(slot?.endTime ?? "10:00");
  const [active, setActive] = useState(slot?.active ?? true);
  const [error, setError] = useState("");

  useEffect(() => {
    setDayOfWeek(slot?.dayOfWeek ?? "monday");
    setStartTime(slot?.startTime ?? "09:00");
    setEndTime(slot?.endTime ?? "10:00");
    setActive(slot?.active ?? true);
  }, [slot]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!startTime || !endTime) return setError("Choose a start and end time.");
    if (startTime >= endTime)
      return setError("End time must be after start time.");
    setError("");
    onSubmit({ dayOfWeek, startTime, endTime, active });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-form-title"
    >
      <form
        onSubmit={submit}
        className="w-full max-w-lg space-y-5 border border-white/10 bg-[#111119] p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400">
              Availability
            </p>
            <h2
              id="schedule-form-title"
              className="mt-1 text-xl font-semibold text-white"
            >
              {slot ? "Edit time slot" : "Add time slot"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-gray-300 sm:col-span-2">
            Day of week
            <select
              value={dayOfWeek}
              onChange={(event) => setDayOfWeek(event.target.value as Weekday)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0b11] px-3 py-2.5 text-white outline-none focus:border-sky-400/60"
            >
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            Start time
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0b11] px-3 py-2.5 text-white outline-none focus:border-sky-400/60"
            />
          </label>
          <label className="text-sm text-gray-300">
            End time
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0b11] px-3 py-2.5 text-white outline-none focus:border-sky-400/60"
            />
          </label>
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 accent-sky-500"
          />
          Slot is active and bookable
        </label>
        {error && (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : slot ? "Save changes" : "Add slot"}
          </button>
        </div>
      </form>
    </div>
  );
}

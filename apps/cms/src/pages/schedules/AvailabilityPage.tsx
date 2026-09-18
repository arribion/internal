import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSchedules } from "@/hooks/queries/useSchedules";
import {
  useActivateSchedule,
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from "@/hooks/mutations/useScheduleMutations";
import { ScheduleSlot, ScheduleSlotInput, Weekday } from "@/types/schedule";
import ScheduleSlotForm from "./ScheduleSlotForm";

const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const label = (day: string) => day.charAt(0).toUpperCase() + day.slice(1);

export default function AvailabilityPage() {
  const { data: slots = [], isLoading, isError, refetch } = useSchedules();
  const [editingSlot, setEditingSlot] = useState<
    ScheduleSlot | null | undefined
  >(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const activateMutation = useActivateSchedule();
  const deleteMutation = useDeleteSchedule();

  const grouped = useMemo(
    () =>
      weekdays.map((day) => ({
        day,
        slots: slots
          .filter((slot) => slot.dayOfWeek.toLowerCase() === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      })),
    [slots],
  );
  const saving = createMutation.isPending || updateMutation.isPending;

  const saveSlot = async (input: ScheduleSlotInput) => {
    try {
      if (editingSlot)
        await updateMutation.mutateAsync({ id: editingSlot.id, input });
      else await createMutation.mutateAsync(input);
      toast.success(
        editingSlot ? "Availability updated" : "Availability added",
      );
      setEditingSlot(undefined);
    } catch {
      toast.error("Could not save this availability slot");
    }
  };

  const removeSlot = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Availability removed");
    } catch {
      toast.error("Could not remove this availability slot");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sky-400">
            Call scheduling
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Availability
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Set the hours clients can request a call with your team.
          </p>
        </div>
        <button
          onClick={() => setEditingSlot(null)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-400"
        >
          <Plus size={17} /> Add time slot
        </button>
      </header>
      <div className="flex flex-wrap gap-3 border-y border-white/10 py-4 text-sm text-gray-400">
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} className="text-sky-400" /> {slots.length}{" "}
          total slots
        </span>
        <span className="inline-flex items-center gap-2">
          <Check size={16} className="text-emerald-400" />{" "}
          {slots.filter((slot) => slot.active).length} active
        </span>
      </div>
      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          <LoadingRow />
          <LoadingRow />
          <LoadingRow />
          <LoadingRow />
        </div>
      )}
      {isError && (
        <div className="border border-rose-400/20 bg-rose-400/5 p-8 text-center sm:rounded-xl">
          <X className="mx-auto text-rose-300" />
          <p className="mt-3 text-white">Availability could not be loaded.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-sm text-rose-300 underline"
          >
            Try again
          </button>
        </div>
      )}
      {!isLoading && !isError && slots.length === 0 && (
        <div className="border border-dashed border-white/15 p-12 text-center sm:rounded-xl">
          <Clock3 className="mx-auto text-gray-600" size={28} />
          <p className="mt-4 text-white">No availability added yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first time slot to open booking hours.
          </p>
        </div>
      )}
      {!isLoading && !isError && slots.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {grouped.map(({ day, slots: daySlots }) => (
            <section
              key={day}
              className="border border-white/10 bg-[#111119] p-4 sm:rounded-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-medium text-white">{label(day)}</h2>
                <span className="text-xs text-gray-600">
                  {daySlots.length} {daySlots.length === 1 ? "slot" : "slots"}
                </span>
              </div>
              {daySlots.length === 0 ? (
                <p className="py-3 text-sm text-gray-600">No hours set</p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${slot.active ? "bg-emerald-400" : "bg-gray-600"}`}
                        />
                        <span className="text-sm text-gray-200">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span
                          className={`text-xs ${slot.active ? "text-emerald-300" : "text-gray-500"}`}
                        >
                          {slot.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() =>
                            activateMutation.mutate({
                              id: slot.id,
                              active: !slot.active,
                            })
                          }
                          className="rounded-md p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                          aria-label={
                            slot.active ? "Deactivate slot" : "Activate slot"
                          }
                        >
                          {slot.active ? (
                            <Check size={15} />
                          ) : (
                            <Clock3 size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingSlot(slot)}
                          className="rounded-md p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                          aria-label="Edit slot"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingId(slot.id)}
                          className="rounded-md p-2 text-gray-500 hover:bg-rose-500/10 hover:text-rose-300"
                          aria-label="Delete slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
      {editingSlot !== undefined && (
        <ScheduleSlotForm
          slot={editingSlot}
          saving={saving}
          onClose={() => setEditingSlot(undefined)}
          onSubmit={saveSlot}
        />
      )}
      {deletingId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-[#111119] p-6">
            <h2 className="text-lg font-semibold text-white">
              Delete this time slot?
            </h2>
            <p className="text-sm text-gray-500">
              This will remove the slot from your booking availability.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={removeSlot}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-rose-500/90 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
  );
}

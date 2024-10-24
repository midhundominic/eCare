import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

import styles from "./slotBooking.module.css";
import Button from "../../../Common/Button";
import { TIME_SLOTS } from "../../../../utils/constant";
import {
  createAppointment,
  getUnavailableTimeSlots,
} from "../../../../services/appointmentServices";
import { usePatient } from "../../../../context/patientContext";

const SlotBooking = ({ selectedDoctor }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2024-10-22");

  const { patient } = usePatient();

  const nextSevenDays = useMemo(() => {
    const days = [];
    let i = 0;
    while (days.length < 7) {
      const day = dayjs().add(i, "day");
      if (day.day() !== 0) {
        days.push(day);
      }
      i++;
    }
    return days;
  }, []);

  useEffect(() => {
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    handleDateSelect(tomorrow);
  }, [selectedDoctor]);

  const handleDateSelect = async (date) => {
    setIsLoading(true);
    setSelectedDate(date);
    setSelectedTimeSlot("");
    if (selectedDoctor && date) {
      try {
        const unavailableSlotsRes = await getUnavailableTimeSlots(selectedDoctor._id, date);
        const { unavailableSlots, unavailable } = unavailableSlotsRes.data;
        
        const now = dayjs();
        const selectedDate = dayjs(date);

        let filteredSlots = TIME_SLOTS;

        // If the doctor is on leave, all slots are unavailable
        if (unavailable) {
          filteredSlots = []; // No slots available if doctor is on leave
        } else {
          filteredSlots = TIME_SLOTS.filter((slot) => {
            const slotTime = dayjs(`${date} ${slot}`, "YYYY-MM-DD hh:mm A");

            // Filter out slots that are either unavailable or in the past
            return (
              !unavailableSlots.includes(slot) &&
              (selectedDate.isAfter(now, "day") || slotTime.isAfter(now))
            );
          });
        }

        setAvailableTimeSlots(filteredSlots);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching time slots. Please try again later.");
      }
    }
  };

  const handleBookSlot = async () => {
    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: patient.userId,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
      };
      await createAppointment(appointmentData);
      toast.success("Appointment scheduled successfully");
      setAvailableTimeSlots(TIME_SLOTS);
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      handleDateSelect(tomorrow);
      setSelectedTimeSlot("");
    } catch (error) {
      toast.error("Error scheduling appointment");
    }
  };

  return (
    <div className={styles.slotRoot}>
      <span>Choose date and time</span>
      <div className={styles.dateOptions}>
        {nextSevenDays.map((day, index) => (
          <button
            key={index}
            className={`${styles.dateBtn} ${
              selectedDate === day.format("YYYY-MM-DD")
                ? styles.dateBtnSelected
                : ""
            }
            }`}
            onClick={() => handleDateSelect(day.format("YYYY-MM-DD"))}
          >
            <div>{day.format("ddd").toUpperCase()}</div>
            <div>{day.format("DD")}</div>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.slotLoader}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={styles.timeSlotOptions}>
            {TIME_SLOTS.map((slot) => {
              const isUnavailable = !availableTimeSlots.includes(slot);
              const slotTime = dayjs(
                `${selectedDate} ${slot}`,
                "YYYY-MM-DD hh:mm A"
              );
              const isPast = slotTime.isBefore(dayjs());
              return (
                <button
                  key={slot}
                  className={`${styles.timeSlotBtn} ${
                    selectedTimeSlot === slot ? styles.timeSlotBtnSelected : ""
                  }
              `}
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={isUnavailable || isPast} // Disable button if unavailable or in the past
                >
                  {slot} {isPast ? " (Past)" : ""}
                </button>
              );
            })}
          </div>
          <div className={styles.btnContainer}>
            <span>{`${dayjs(selectedDate).format(
              "MMM D, dddd"
            )} ${selectedTimeSlot && "| "+selectedTimeSlot}`}</span>
            <Button
              onClick={handleBookSlot}
              isDisabled={!selectedDate || !selectedTimeSlot}
              styles={{ btnPrimary: styles.customeBtn }}
            >
              Book
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SlotBooking;

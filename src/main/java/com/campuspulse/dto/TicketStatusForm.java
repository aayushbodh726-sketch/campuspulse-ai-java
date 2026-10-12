package com.campuspulse.dto;

import com.campuspulse.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketStatusForm {
    @NotNull private TicketStatus status;
    @Size(max = 500) private String note;
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}

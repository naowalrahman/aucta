"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Typography,
  CircularProgress,
  FormHelperText,
  Alert,
} from "@mui/material";
import { useAuth } from "@/lib/auth-context";
import { createAuction } from "@/lib/database";
import { Auction } from "@/lib/database-types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function CreateAuctionDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    imageUrl: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    startingPrice: false,
    startDate: false,
    endDate: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, startDate: date });
      if (formErrors.startDate) {
        setFormErrors({ ...formErrors, startDate: false });
      }
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, endDate: date });
      if (formErrors.endDate) {
        setFormErrors({ ...formErrors, endDate: false });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: formData.title.trim() === "",
      description: formData.description.trim() === "",
      startingPrice:
        !formData.startingPrice || isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0,
      startDate: formData.startDate < new Date(),
      endDate: formData.endDate <= formData.startDate,
    };

    setFormErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      setError("You must be logged in to create an auction");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const auctionData: Omit<Auction, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: Number(formData.startingPrice),
        imageUrl: formData.imageUrl.trim() || undefined,
        startDate: formData.startDate.getTime(),
        endDate: formData.endDate.getTime(),
        createdBy: user.uid,
        status: "active",
      };

      await createAuction(auctionData);
      onSuccess();

      // Reset form
      setFormData({
        title: "",
        description: "",
        startingPrice: "",
        imageUrl: "",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      console.error("Error creating auction:", error);
      setError(error instanceof Error ? error.message : "Failed to create auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset error state
      setError(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Auction</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid>
            <TextField
              name="title"
              label="Auction Title"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange}
              error={formErrors.title}
              helperText={formErrors.title ? "Title is required" : ""}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              error={formErrors.description}
              helperText={formErrors.description ? "Description is required" : ""}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid>
            <TextField
              name="startingPrice"
              label="Starting Price"
              fullWidth
              required
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              value={formData.startingPrice}
              onChange={handleChange}
              error={formErrors.startingPrice}
              helperText={formErrors.startingPrice ? "Valid price is required" : ""}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid>
            <TextField
              name="imageUrl"
              label="Image URL (optional)"
              fullWidth
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Auction Dates
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid>
                  <DateTimePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formErrors.startDate,
                      },
                    }}
                    disablePast
                  />
                  {formErrors.startDate && <FormHelperText error>Start date cannot be in the past</FormHelperText>}
                </Grid>

                <Grid>
                  <DateTimePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={handleEndDateChange}
                    minDate={formData.startDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formErrors.endDate,
                      },
                    }}
                    disablePast
                  />
                  {formErrors.endDate && <FormHelperText error>End date must be after start date</FormHelperText>}
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Creating..." : "Create Auction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

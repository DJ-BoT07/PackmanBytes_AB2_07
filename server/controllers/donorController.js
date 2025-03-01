import { handleError } from "../helpers/handleError.js";
import Donor from "../models/donorModel.js";

export const getDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({
      donors,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const addDonor = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, phone, age, gender, bloodGroup, location, available ,city, district, state, country } =
      req.body;
  
    if (!location || !location?.coordinates[0] || !location?.coordinates[1]) {
      return res.status(400).json({
        success: false,
        message: "Location must include both latitude and longitude.",
      });
    }

    const donor = new Donor({
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      location: {
        type: "Point",
        coordinates: [location.coordinates[0], location.coordinates[1]],
      },
      city,
      district,
      state,
      country,
      available,
    });

    await donor.save();

    res.status(200).json({
      success: true,
      message: "Donor added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    const donor = await Donor.findById(donorid);
    if (!donor) {
      return next(handleError(404, "Donor not found"));
    }
    res.status(200).json({
      donor,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    const { name, email, phone, age, gender, bloodGroup, location, available } =
      req.body;

    if (!location || !location.longitude || !location.latitude) {
      return res.status(400).json({
        success: false,
        message: "Location must include both latitude and longitude.",
      });
    }

    const donor = await Donor.findById(donorid);

      donor.name = name,
      donor.phone = phone,
      donor.age = age,
      donor.gender = gender,
      donor.bloodGroup = bloodGroup,
      donor.location = {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      donor.available = available;

    await donor.save();

    res.status(200).json({
      success: true,
      message: "Donor updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    await Donor.findByIdAndDelete(donorid);

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const Offer = require('../models/offerModel.js');
const express = require('express');

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.getOfferById = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.getOffersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const offers = await Offer.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    // Return 200 with an array (possibly empty)
    return res.status(200).json(offers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.createOffer = async (req, res) => {
  const { offerTitle, offerDescription, offerDuration, offerCategory, location, skillsRequired, helpersRequired, availability, contactInfo } = req.body;
  try {
    const newOffer = new Offer({
        offerTitle,
        offerDescription,
        offerDuration,
        offerCategory,
        location,
        skillsRequired,
        helpersRequired,
        availability,
        contactInfo
        // createdBy: req.user._id // Assuming req.user is set by authentication middleware

    });
    await newOffer.save();
    res.status(201).json({ message: 'Note created successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.updateOffer = async (req, res) => {
  const { id } = req.params;
  const { offerTitle, offerDescription, offerDuration, offerCategory, availability, location, helpersRequired } = req.body;
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(id, {
        offerTitle,
        offerDescription,
        offerDuration,
        offerCategory,
        availability,
        location,
        helpersRequired
    }, { new: true });
    
    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found!' });
    }
    res.status(200).json({ message: 'Internal server error', updatedOffer });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
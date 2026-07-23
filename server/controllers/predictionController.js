// @route POST /api/predict
const predict = (req, res) => {
  try {
    const {
      attended,
      conducted,
      target,
      periodsPerDay = 7,
      futureAbsences,
    } = req.body;

    if (conducted === 0) return res.status(400).json({ message: 'Conducted cannot be 0' });

    const currentPct = (attended / conducted) * 100;

    // Option A & B: periods/days needed to reach target
    let periodsNeeded = null;
    let daysNeeded = null;
    if (target) {
      // (attended + x) / (conducted + x) = target/100
      // x = (target*conducted - 100*attended) / (100 - target)
      const x = (target * conducted - 100 * attended) / (100 - target);
      periodsNeeded = x > 0 ? Math.ceil(x) : 0;
      daysNeeded = Math.ceil(periodsNeeded / periodsPerDay);
    }

    // Option C: what if I miss N classes
    let afterAbsences = null;
    if (futureAbsences !== undefined) {
      const newConducted = conducted + futureAbsences;
      afterAbsences = newConducted
        ? ((attended / newConducted) * 100).toFixed(2)
        : 0;
    }

    res.json({
      currentPercentage: currentPct.toFixed(2),
      periodsNeeded,
      daysNeeded,
      afterAbsences,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/predict/simulate
const simulate = (req, res) => {
  try {
    const { attended, conducted, action } = req.body; // action: 'present' | 'absent'
    const newConducted = conducted + 1;
    const newAttended = action === 'present' ? attended + 1 : attended;
    const newPct = ((newAttended / newConducted) * 100).toFixed(2);
    res.json({ attended: newAttended, conducted: newConducted, percentage: newPct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { predict, simulate };

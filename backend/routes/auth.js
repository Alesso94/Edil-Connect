// Endpoint per il cambio password
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findOne({ _id: req.user._id });

        // Verifica la password attuale
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Password attuale non corretta' });
        }

        // Aggiorna la password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Errore nel cambio password:', error);
        res.status(500).json({ error: 'Errore nel cambio password' });
    }
}); 
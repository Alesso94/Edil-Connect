const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { protect } = require('../middleware/authMiddleware');

// Get all projects
router.get('/', protect, async (req, res) => {
    try {
        console.log('Recupero progetti per utente:', req.user._id);
        const projects = await Project.find({ 
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        }).populate('owner', 'email name profession');
        
        console.log('Progetti trovati:', projects.length);
        res.json(projects);
    } catch (error) {
        console.error('Errore nel recupero dei progetti:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new project
router.post('/', protect, async (req, res) => {
    try {
        console.log('Creazione nuovo progetto per utente:', req.user._id);
        const project = new Project({
            ...req.body,
            owner: req.user._id
        });

        const newProject = await project.save();
        console.log('Nuovo progetto creato:', newProject._id);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Errore nella creazione del progetto:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a project
router.put('/:id', protect, async (req, res) => {
    try {
        console.log('Aggiornamento progetto:', req.params.id);
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Progetto non trovato' });
        }

        // Verifica che l'utente sia il proprietario
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Solo il proprietario può modificare il progetto' });
        }

        // Campi che possono essere aggiornati
        const updatableFields = [
            'name', 'description', 'status', 'location', 
            'estimatedCost', 'startDate', 'endDate'
        ];
        
        // Aggiorna solo i campi consentiti
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
            }
        });

        const updatedProject = await project.save();
        console.log('Progetto aggiornato con successo');
        res.json(updatedProject);
    } catch (error) {
        console.error('Errore nell\'aggiornamento del progetto:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a project
router.delete('/:id', protect, async (req, res) => {
    try {
        console.log('Eliminazione progetto:', req.params.id);
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Progetto non trovato' });
        }

        // Verifica che l'utente sia il proprietario
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Solo il proprietario può eliminare il progetto' });
        }

        await project.deleteOne();
        console.log('Progetto eliminato con successo');
        res.json({ message: 'Progetto eliminato con successo' });
    } catch (error) {
        console.error('Errore nell\'eliminazione del progetto:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add a task to a project
router.post('/:projectId/task', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Progetto non trovato" });
        }
        
        // Verifica che l'utente sia il proprietario o un collaboratore
        if (project.owner.toString() !== req.user._id.toString() && 
            !project.collaborators.includes(req.user._id)) {
            return res.status(403).json({ message: "Non autorizzato" });
        }

        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status,
            priority: req.body.priority,
            assignedTo: req.body.assignedTo
        };

        project.tasks.push(task);
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific project
router.get('/:id', protect, async (req, res) => {
    try {
        console.log('Recupero dettagli progetto:', req.params.id);
        const project = await Project.findById(req.params.id)
            .populate('owner', 'email name profession')
            .populate('collaborators', 'email name profession');
        
        if (!project) {
            return res.status(404).json({ message: 'Progetto non trovato' });
        }

        // Verifica che l'utente sia il proprietario o un collaboratore
        if (project.owner._id.toString() !== req.user._id.toString() && 
            !project.collaborators.some(collab => collab._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Non autorizzato' });
        }

        console.log('Dettagli progetto recuperati con successo');
        res.json(project);
    } catch (error) {
        console.error('Errore nel recupero dei dettagli del progetto:', error);
        res.status(500).json({ message: error.message });
    }
});

// Aggiungi collaboratore al progetto
router.put('/:projectId/collaborator', protect, async (req, res) => {
  try {
    const { collaboratorId } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Progetto non trovato" });
    }
    
    // Verifica che l'utente sia il proprietario
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Solo il proprietario può aggiungere collaboratori" });
    }
    
    // Verifica che il collaboratore non sia già presente
    if (project.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ message: "L'utente è già un collaboratore" });
    }
    
    project.collaborators.push(collaboratorId);
    await project.save();
    
    // Popola i dati del collaboratore prima di inviare la risposta
    await project.populate('collaborators', 'name email profession');
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
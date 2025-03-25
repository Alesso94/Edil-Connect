const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ 
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        }).populate('owner', 'email name profession');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new project
router.post('/', auth, async (req, res) => {
    const project = new Project({
        ...req.body,
        owner: req.user._id
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a task to a project
router.post('/:projectId/task', auth, async (req, res) => {
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
router.get('/:id', auth, async (req, res) => {
    try {
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

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Aggiungi collaboratore al progetto
router.put('/:projectId/collaborator', auth, async (req, res) => {
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
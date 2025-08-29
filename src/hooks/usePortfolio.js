import { useState, useEffect, useCallback } from 'react';
import portfolioService from '../services/portfolioService';

// Hook for managing projects
export const useProjects = (featured = null) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getProjects(featured);
      setProjects(response.documents || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [featured]);

  const createProject = async (projectData) => {
    try {
      const newProject = await portfolioService.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await portfolioService.updateProject(projectId, projectData);
      setProjects(prev => prev.map(p => p.$id === projectId ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await portfolioService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.$id !== projectId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};

// Hook for managing skills
export const useSkills = (category = null) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getSkills(category);
      setSkills(response.documents || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const createSkill = async (skillData) => {
    try {
      const newSkill = await portfolioService.createSkill(skillData);
      setSkills(prev => [...prev, newSkill]);
      return newSkill;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSkill = async (skillId, skillData) => {
    try {
      const updatedSkill = await portfolioService.updateSkill(skillId, skillData);
      setSkills(prev => prev.map(s => s.$id === skillId ? updatedSkill : s));
      return updatedSkill;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await portfolioService.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.$id !== skillId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    skills,
    loading,
    error,
    refetch: fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill
  };
};

// Hook for managing experience
export const useExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getExperiences();
      setExperiences(response.documents || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExperience = async (experienceData) => {
    try {
      const newExperience = await portfolioService.createExperience(experienceData);
      setExperiences(prev => [...prev, newExperience]);
      return newExperience;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateExperience = async (experienceId, experienceData) => {
    try {
      const updatedExperience = await portfolioService.updateExperience(experienceId, experienceData);
      setExperiences(prev => prev.map(e => e.$id === experienceId ? updatedExperience : e));
      return updatedExperience;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteExperience = async (experienceId) => {
    try {
      await portfolioService.deleteExperience(experienceId);
      setExperiences(prev => prev.filter(e => e.$id !== experienceId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    loading,
    error,
    refetch: fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience
  };
};

// Hook for managing about information
export const useAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const aboutData = await portfolioService.getAbout();
      setAbout(aboutData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching about info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAbout = async (aboutData) => {
    try {
      const newAbout = await portfolioService.createAbout(aboutData);
      setAbout(newAbout);
      return newAbout;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAbout = async (aboutData) => {
    try {
      if (!about?.$id) {
        return await createAbout(aboutData);
      }
      const updatedAbout = await portfolioService.updateAbout(about.$id, aboutData);
      setAbout(updatedAbout);
      return updatedAbout;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  return {
    about,
    loading,
    error,
    refetch: fetchAbout,
    createAbout,
    updateAbout
  };
};

// Hook for managing contact messages
export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getContacts();
      setContacts(response.documents || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = async (contactData) => {
    try {
      const newContact = await portfolioService.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const updatedContact = await portfolioService.updateContactStatus(contactId, status);
      setContacts(prev => prev.map(c => c.$id === contactId ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    refetch: fetchContacts,
    createContact,
    updateContactStatus
  };
};

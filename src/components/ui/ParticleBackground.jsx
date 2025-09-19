import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import PropTypes from 'prop-types';

const ParticleBackground = ({ isDark = false, density = 80 }) => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particleOptions = {
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: isDark ? "#6366f1" : "#8b5cf6",
            },
            links: {
                color: isDark ? "#4f46e5" : "#7c3aed",
                distance: 150,
                enable: true,
                opacity: isDark ? 0.2 : 0.15,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 0.8,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: density,
            },
            opacity: {
                value: isDark ? 0.4 : 0.3,
                animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.1,
                },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.5,
                },
            },
        },
        detectRetina: true,
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particleOptions}
            className="absolute inset-0 z-0"
        />
    );
};

ParticleBackground.propTypes = {
    isDark: PropTypes.bool,
    density: PropTypes.number
};

export default ParticleBackground;
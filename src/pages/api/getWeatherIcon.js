export const getIcon = async (iconName) => {
    try {
        // Use dynamic import with alias
        const icon = await import(`@/storage/weatherIcons/${iconName}.svg`);
        return icon.default; // Return the SVG path
    } catch (error) {
        console.error(`Icon not found: ${iconName}, using default icon.`);
        // Fallback to default icon
        const defaultIcon = await import(`@/storage/weatherIcons/default.svg`);
        return defaultIcon.default;
    }
};

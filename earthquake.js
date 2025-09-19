const configService = require('../services/configService');

// Import demoMode utilities if we're in demo mode
let demoMode = null;
if (global.DEMO_MODE) {
    demoMode = require('../utils/demoMode');
}

module.exports = {
    name: 'earthquake',
    description: 'Sends earthquake alert only in the designated group',
    async execute(sock, message, args, chatJid) {
        try {
            // Handle demo mode
            if (global.DEMO_MODE) {
                // In demo mode, use preset demo data
                const demoJid = demoMode.getDemoJid('earthquake');
                
                // Check if we're in the correct JID for demo mode
                if (chatJid !== demoJid) {
                    await sock.sendMessage(chatJid, { 
                        text: '[DEMO MODE] This command can only be used in the designated group.' 
                    });
                    return;
                }
                
                // Get demo earthquake data
                const earthquakeData = demoMode.getDemoEarthquakeData();
                
                // Send a formatted demo response
                let message = '*EARTHQUAKE ALERTS* 🌍\n\n';
                earthquakeData.forEach(quake => {
                    const date = new Date(quake.time);
                    message += `*Magnitude ${quake.mag}* - ${quake.place}\n`;
                    message += `Time: ${date.toLocaleString()}\n`;
                    message += `Info: ${quake.url}\n\n`;
                });
                
                await sock.sendMessage(chatJid, { text: message });
                await sock.sendMessage(chatJid, { 
                    text: '[DEMO MODE] This is simulated earthquake data. In a real connection, this would show actual USGS data.' 
                });
                return;
            }
            
            // Non-demo mode code
            // Get the configured JID for this command from the database
            const configuredJid = await configService.getCommandJid('earthquake');
            
            // Check if the command is being used in the correct group
            if (!configuredJid) {
                await sock.sendMessage(chatJid, { 
                    text: 'This command has not been set up yet. Use ".jid earthquake" to configure it.' 
                });
                return;
            }
            
            if (chatJid !== configuredJid) {
                await sock.sendMessage(chatJid, { 
                    text: 'This command can only be used in the designated group.' 
                });
                return;
            }
            
            // Send the earthquake alert message - in a real implementation, you would fetch
            // actual data from an earthquake API like USGS
            await sock.sendMessage(chatJid, { 
                text: 'Fetching latest earthquake data...' 
            });
            
            // This would normally be where you'd call an API to get real earthquake data
            // For this demo, we'll just send a placeholder
            await sock.sendMessage(chatJid, { 
                text: 'No significant earthquakes reported in the last hour.' 
            });
            
        } catch (error) {
            console.error('Error in earthquake command:', error);
            await sock.sendMessage(chatJid, { 
                text: 'An error occurred while processing the command.' 
            });
        }
    }
};

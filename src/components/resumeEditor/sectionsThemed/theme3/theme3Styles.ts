// Common styles for Theme3
export const theme3Styles = {
  // Typography
  title: "text-2xl font-playfair font-semibold text-red-500 italic",
  subtitle: "text-xl font-playfair text-red-400 italic",
  heading: "text-lg font-playfair font-medium text-red-300 italic",
  body: "font-playfair text-red-200",
  caption: "font-playfair text-red-400 italic text-sm",
  
  // Containers
  container: `relative bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 
              p-4 rounded-lg group transition-all duration-300 
              hover:shadow-lg hover:shadow-red-900/50 
              border border-red-800/30 hover:border-red-700
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`,
              
  // Dividers
  divider: `relative mb-4 after:content-[''] after:absolute after:left-0 
           after:right-0 after:-bottom-1 after:h-px after:bg-red-800 
           after:opacity-50 after:border-dashed`,
           
  // Buttons
  button: `flex items-center px-6 py-2 
           bg-gradient-to-r from-red-900 to-gray-900 
           text-red-400 rounded-full group
           hover:from-red-800 hover:to-gray-800 
           transition-all duration-300 font-playfair italic
           border border-red-800/30 hover:border-red-700
           hover:shadow-lg hover:shadow-red-900/30`,
           
  // Input fields
  input: `w-full bg-transparent border-none focus:outline-none focus:ring-0 
          font-playfair italic text-red-200 placeholder-red-700/50
          selection:bg-red-900 selection:text-red-100`,
          
  // Links
  link: "text-red-500 hover:text-red-400 transition-colors duration-200 font-playfair italic",
  
  // Icons
  icon: "text-red-500 group-hover:text-red-400 transition-colors duration-200"
};

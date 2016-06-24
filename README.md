# TYPO3 Namespace Converter

You have old TYPO3 extensions that returned from their grave and want to use them in new TYPO3 6 and 7 projects?
To bad, because you have to namespace all your classes by hand...

Really?

NO! Now you can use this little but pretty handy node tool to refactor all your TYPO3 PHP junks into sexy PSR4 conform classes.

# Install

1. Pull from git
2. Run `npm install`

# How to use

    node main.js <old-namespace> <new-namespace> <folder-to-namespace-root>
    
    Example:
    node main.js Tx_PackageName "Vendor\PackageName" "H:\Code\Project\some\sub\folder\Classes"
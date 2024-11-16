import xml.etree.ElementTree as ET

def remove_white_background(svg_file, output_file):
    # Register namespaces
    ET.register_namespace('', "http://www.w3.org/2000/svg")

    tree = ET.parse(svg_file)
    root = tree.getroot()

    # Namespaces might be required for SVG elements
    namespaces = {'svg': 'http://www.w3.org/2000/svg'}

    # Find all elements with a white fill and replace it with none
    for element in root.findall('.//*[@fill="white"]', namespaces):
        element.set('fill', 'none')

    # Save the modified SVG to a new file
    tree.write(output_file, xml_declaration=True, encoding='utf-8', method="xml")

# Usage example
remove_white_background('cyclist_fond.svg', 'output.svg')

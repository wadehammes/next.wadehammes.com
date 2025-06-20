#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <component-name>"
    exit 1
fi

COMPONENT_NAME=$1
COMPONENT_DIR="src/components/$COMPONENT_NAME"

# Create component directory
mkdir -p "$COMPONENT_DIR"

# Create component file
cat > "$COMPONENT_DIR/$COMPONENT_NAME.component.tsx" << EOF
import classNames from "classnames";
import styles from "./$COMPONENT_NAME.module.css";

interface ${COMPONENT_NAME}Props {
  className?: string;
}

export const ${COMPONENT_NAME} = ({ className }: ${COMPONENT_NAME}Props) => {
  return (
    <div className={classNames(styles.${COMPONENT_NAME,}, className)}>
      ${COMPONENT_NAME}
    </div>
  );
};

export default ${COMPONENT_NAME};
EOF

# Create CSS module file
cat > "$COMPONENT_DIR/$COMPONENT_NAME.module.css" << EOF
.${COMPONENT_NAME,} {
  /* Add your styles here */
}
EOF

# Create index file
cat > "$COMPONENT_DIR/index.ts" << EOF
export { ${COMPONENT_NAME} } from "./$COMPONENT_NAME.component";
export { default } from "./$COMPONENT_NAME.component";
EOF

echo "Component $COMPONENT_NAME created successfully!"
echo "Files created:"
echo "  - $COMPONENT_DIR/$COMPONENT_NAME.component.tsx"
echo "  - $COMPONENT_DIR/$COMPONENT_NAME.module.css"
echo "  - $COMPONENT_DIR/index.ts"
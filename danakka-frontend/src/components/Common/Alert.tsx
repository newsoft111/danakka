import React, { useState, useRef, useEffect } from 'react';
import {
	Alert as ChakraAlert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	CloseButton
} from '@chakra-ui/react'

interface AlertProps {
	status: 'error' | 'success' | 'warning' | 'info';
	description: string;
}

const Alert: React.FC<AlertProps> = ({ status, description }) => {
	const [isClosed, setIsClosed] = useState(false);
	const alertRef = useRef<HTMLDivElement>(null);
  	const [alertWidth, setAlertWidth] = useState<string | number>('auto');

	  useEffect(() => {
		// Measure the width of the text inside the Alert
		if (alertRef.current) {
		  const textWidth = alertRef.current.getBoundingClientRect().width;
		  setAlertWidth(textWidth);
		}

	}, [description]);

	if (isClosed) {
		return null; // Don't render the alert if it's closed
	}

	return (
		<>
			<ChakraAlert
				status={status}
				position="absolute" // Use absolute positioning
				top="20px" // Adjust the top value as needed
				left="50%" // Center horizontally, you can adjust this value as well
				transform="translateX(-50%)" // Center horizontally using the left position
				width={alertWidth} // Set the width dynamically based on the text length
				borderRadius="md" // Add rounded corners to the Alert
      			zIndex={999} // Set a high z-index to ensure the Alert is always on top
			>
				<AlertIcon />
				<AlertDescription isTruncated>{description}</AlertDescription>
				<CloseButton
					right="8px"
					top="8px"
					onClick={() => setIsClosed(true)}
				/>
			</ChakraAlert>
		</>
	);
};

export default Alert;

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ChakraProvider} from "@chakra-ui/react";
import {PointsProvider} from "./PointsProvider.jsx";

const queryClient = new QueryClient();

export function Providers({children}) {
	return (
		<QueryClientProvider client={queryClient}>
			<PointsProvider>
				<ChakraProvider>
					{children}
				</ChakraProvider>
			</PointsProvider>
		</QueryClientProvider>
	)
}
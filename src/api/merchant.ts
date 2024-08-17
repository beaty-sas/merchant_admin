import axiosInstance, {endpoints} from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function updateMerchant(data: any) {
	const URL = endpoints.merchant.me;

	const response = await axiosInstance.patch(URL, data);
	return response.data;
}

// ----------------------------------------------------------------------

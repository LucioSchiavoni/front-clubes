import DateOrdersForm from '@/components/forms/DateOrdersForm'
import DefaultLayout from '@/layouts/default'
import { useParams } from 'react-router-dom'

const ClubDatesPage = () => {
    const { clubId } = useParams();
    
    if (!clubId) {
        return (
            <DefaultLayout>
                <div className="text-center text-red-600">
                    Error: No se proporcionó un ID de club válido
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <DateOrdersForm clubId={clubId}/>
        </DefaultLayout>
    )
}

export default ClubDatesPage
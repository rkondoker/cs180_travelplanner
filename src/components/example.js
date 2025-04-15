import Link from 'next/link';

const Example = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Link href="https://github.com/rkondoker/CS180_TravelPlanner" className="bg-red-400 p-4 rounded-full" target="_blank">Our Repository</Link>
        </div>
    );
}

export default Example;

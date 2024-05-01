import Image from 'next/image'

export default function Facility({ label, image }) {
  return (
    <div className='flex gap-1'>
        <div className='w-4 flex items-center justify-center'>
            <Image
                src={image}
                alt="Hero Image"
                height={1500}
                width={1500}
            />
        </div>
        <p>{label}</p>
    </div>
  );
}
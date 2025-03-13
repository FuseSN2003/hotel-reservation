import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  step: number;
};

export default function StepHeader({ title, step }: Props) {
  return (
    <CardHeader className="p-0">
      <CardDescription className="text-lg">Step {step}</CardDescription>
      <CardTitle className="text-primary text-3xl font-black">
        {title}
      </CardTitle>
    </CardHeader>
  );
}

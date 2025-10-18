import React from 'react';
import HomePicturesPage from './HomePicturesPage';

// This is the page.tsx for the [claimId] dynamic route
interface PageProps {
  params: Promise<{
    recipeId: string;
  }>;
}
export default async function ClaimDetailPage({ params }: PageProps) {
  return <HomePicturesPage params={params} />;
}
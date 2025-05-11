"use client"
import React from 'react';
import HomePicturesPage from './HomePicturesPage';

// This is the page.tsx for the [claimId] dynamic route
interface PageProps {
  params: {
    claimId: string;
  };
}

export default function ClaimDetailPage({ params }: PageProps) {
  return <HomePicturesPage claimId={params.claimId} />;
}
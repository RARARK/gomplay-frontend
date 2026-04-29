import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export type CreatePostExerciseGridOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export const CREATE_POST_EXERCISE_GRID_OPTIONS: readonly CreatePostExerciseGridOption[] =
  [
    {
      value: "당구",
      label: "당구",
      icon: (
        <MaterialCommunityIcons
          name="billiards-rack"
          size={28}
          color="#EF5A24"
        />
      ),
    },
    {
      value: "야구",
      label: "야구",
      icon: <MaterialCommunityIcons name="baseball" size={28} color="#EF5A24" />,
    },
    {
      value: "볼링",
      label: "볼링",
      icon: <MaterialCommunityIcons name="bowling" size={28} color="#EF5A24" />,
    },
    {
      value: "자전거",
      label: "자전거",
      icon: <Ionicons name="bicycle-outline" size={28} color="#EF5A24" />,
    },
    {
      value: "러닝",
      label: "러닝",
      icon: <MaterialCommunityIcons name="run" size={28} color="#EF5A24" />,
    },
    {
      value: "축구",
      label: "축구",
      icon: <Ionicons name="football-outline" size={28} color="#111111" />,
    },
    {
      value: "풋살",
      label: "풋살",
      icon: <Ionicons name="footsteps-outline" size={28} color="#5664F5" />,
    },
    {
      value: "테니스",
      label: "테니스",
      icon: (
        <MaterialCommunityIcons name="tennis-ball" size={28} color="#58B95C" />
      ),
    },
    {
      value: "등산",
      label: "등산",
      icon: <Ionicons name="triangle-outline" size={28} color="#3E8D53" />,
    },
    {
      value: "농구",
      label: "농구",
      icon: <Ionicons name="basketball-outline" size={28} color="#FF6A00" />,
    },
    {
      value: "배드민턴",
      label: "배드민턴",
      icon: (
        <MaterialCommunityIcons name="badminton" size={28} color="#3E8D53" />
      ),
    },
    {
      value: "헬스",
      label: "헬스",
      icon: <Ionicons name="barbell-outline" size={28} color="#3E8D53" />,
    },
  ] as const;
